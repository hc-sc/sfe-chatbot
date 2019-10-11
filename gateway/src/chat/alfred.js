import "./alfred.scss";
import io from 'socket.io-client';
import { format } from "date-fns";

/**
 * @function delay
 * @description Delays async execution for a given duration
 * @param {number} timeout Timeout duration (ms)(default: 1000)
 */
const delay = ( timeout = 1000 ) => new Promise( ( resolve, reject ) => {
  try {
    setTimeout( resolve, timeout );
  }
  catch( err ) {
    reject( err );
  }
} );

/**
 * @class Alfred
 * @description Alfred UI class
 */
class Alfred {
  constructor( lang = "en" ) {
    // TODO: Bilingual
    this.lang = lang;

    try {
      this.isIE = wb
        ?  wb.ie11
        || wb.ie6
        || wb.ie7
        || wb.ie8
        || wb.ie9
        || wb.ie10
        || wb.ie
      : false;
    }
    catch (err) {
      console.log( "Error detecting IE components", err );
    }
  }

  /**
   * @method init
   * @description Initializes chatbot in window, retrieving local data and spawning UI components
   */
  async init() {
    // Initialize UI components
    // TODO: ACCESSIBILITY
    // TODO: Bilingual
    const open = JSON.parse( localStorage.getItem( "alfred-is-open" ) );
    
    this.$doc = $( "body" );
    // TODO: Apply closed state based on value from sessionstorage
    this.$self = $( `<section class="alfred"></section>` );

    if ( !open ) {
      this.$self.addClass( "closed" );
    }

    this.$header = $( `
<div class="al-header">
  <p role="heading" class="al-title">
    Alfred
    <span class="glyphicon glyphicon-comment"></span>
  </p>
  <p role="button" class="al-collapse">
    <span class="glyphicon glyphicon-minus"></span>
    <span class="glyphicon glyphicon-plus"></span>
  </p>
</div>
    ` );

    this.$self.append( this.$header );

    this.$body = $( `<div class="al-body"></div>` );

    // Add IE workaround class to body element if running in IE
    if ( this.isIE ) {
      this.$body.addClass( "al-body-ie" );
    }

    this.$messageWrapper = $( '<div class="al-messages"></div>' );
    this.$typingAnimation = $( `
<div class="al-typing">
  <span class="al-dot">.</span>
  <span class="al-dot">.</span>
  <span class="al-dot">.</span>
</div>
    ` );

    this.$typingAnimation.hide();

    this.$messageWrapper.append( this.$typingAnimation );
    this.$body.append( this.$messageWrapper );
    this.$self.append( this.$body );
    
    this.$footer = $( `<form class="al-footer" autocomplete="off"></form>` );
    this.$input = $( `<input class="al-in" type='text' placeholder="Try talking to alfred..." name='alfred'>` );
    this.$submitBtn = $( `
<button type="submit" class="btn al-send">
  <span class="glyphicon glyphicon-send"></span>
</button>
    ` );

    this.$footer
      .append( this.$input )
      .append( this.$submitBtn );
    this.$self.append( this.$footer );
    this.$doc.append( this.$self );

    // Initialize conversational components

    this.userId = await this.getUserId( );
    this.conversationHistory = await this.getConversationHistory( this.userId );

    if ( this.conversationHistory ) {
      // Append history to chat window
      for ( const chatEvent of this.conversationHistory.events ) {
        if ( /^(?:user|bot)$/.test( chatEvent.event ) ) {
          this.appendChatMessage( chatEvent.text, chatEvent.event === 'bot', chatEvent.timestamp );

          if ( 'data' in chatEvent ) {
            const { buttons } = chatEvent.data;
            this.appendChatButtons( buttons );
          }
        }
      }
    }
    else {
      // TODO: handle error fetching conversation history
      console.warn( "Unable to fetch conversation history" );
    }

    // Initialize Socket.IO
    // this.socket = io( "http://localhost:3000/api/alfred/socket.io/" );
    this.socket = io( "/api/alfred/socket.io/" );
    const self = this;

    this.socket.on( 'connection', socket => {
      console.log( "DEBUG: SOCKET", socket );

      self.socket.emit( 'session_request', { session_id: self.userId }, data => {
        console.log( 'DEBUG: SESSION REQUEST', data );
      } );
    } );

    window.socket = this.socket;

    // Enable UI events

    // Toggle header on mouse click
    this.$header.on( 'click vclick', this.toggle );
    
    // Change chat focus on mouseover
    this.$messageWrapper.on( "mouseover", this.focus );
    this.$messageWrapper.on( "mouseout", this.blur );

    // Handle user typing input
    this.$input.on( "input", this.handleUserTyping );
    
    // Handle user input on chat submission
    this.$footer.on( 'submit', this.handleChatInput );
  }

  /**
   * @function handleUserTyping
   * @description Start user typing animation with debounce
   */
  handleUserTyping = ( user = true ) => {
    try {
      clearTimeout( this.typingDebounce );
      this.typingDebounce = setTimeout( this.stopTyping, 750 );
      this.startUserTyping();
    }
    catch( err ) {
      console.log( err );
    }
  };

  /**
   * @function startUserTyping
   * @description Start typing animation for user
   */
  startUserTyping = () => {
    this.$typingAnimation.removeClass( "al-bot" );
    this.$typingAnimation.show();
    this.scrollToBottom();
  }

  /**
   * @function startBotTyping
   * @description Start typing animation for bot
   */
  startBotTyping = () => {
    this.$typingAnimation.addClass( "al-bot" );
    this.$typingAnimation.show();
    this.scrollToBottom();
  }

  /**
   * @function stopTyping
   * @description End typing animation
   */
  stopTyping = () => {
    clearTimeout( this.typingDebounce );
    this.$typingAnimation.hide();
  }

  /**
   * @property {bool} isOpen
   * @description Returns true if the chat UI is expanded
   */
  get isOpen() {
    return !this.$self.hasClass( 'closed' );
  }

  /**
   * @method toggle
   * @description Toggles expanded/collapsed state of chat window
   */
  // TODO: Toggle closed state in session storage.
  toggle = () => {
    this.$self.toggleClass( 'closed' );
    localStorage.setItem( "alfred-is-open", !this.$self.hasClass( 'closed' ) );
    setTimeout( this.scrollToBottom, 10 );
  }

  /**
   * @method focus
   * @description Focuses chat body
   */
  focus = () => { this.$messageWrapper.focus(); }

  /**
   * @method blur
   * @description Returns focus from chat body to previous state
   */
  blur = () => { this.$messageWrapper.blur(); }

  /**
   * @method getUserId
   * @description Retrieves userId
   */
  getUserId = async () => {
    let userId = localStorage.getItem( "alfred-user-id" );

    // If no userId cached, generate one from API call
    if ( !userId ) {
      const response = await ( await fetch( `/api/alfred/users/new` ) ).json() || null;
      userId = response.userId;
      
      // If userId still not set throw error, otherwise cache generated userId in browser storage
      if ( !userId ) {
        throw new Error( "Alfred Error: Problem getting userId" );
      }

      localStorage.setItem( "alfred-user-id", userId );
    }

    return userId;
  }

  /**
   * @method getConversationHistory
   * @description Attempts to get the conversation tracker for current user.
   * @param {string} userId
   * @returns {Object}
   */
  getConversationHistory = async userId => {
    if ( typeof userId !== "string" ) {
      console.warn( "'userId' must be a string!" );
      return false;
    }
    
    try {
      // TODO: Handle debug URLS - consider constants data file.
      const conversationHistory = await fetch( `/api/alfred/conversations/${ userId }/tracker`, {
        method: 'GET',
        mode: 'cors',
      } );

      // TODO: Cache messages history in sessionstorage
      return await conversationHistory.json();
    }
    catch( err ) {
      console.warn( `Problem fetching conversation tracker for user ${ userId }: `, err );
      return false;
    }
  }

  /**
   * @method ask
   * @description Sends a message to alfred and awaits for and returns a response
   * @param {string} msg
   * @returns {Object}
   */
  ask = async ( message, sender = this.userId ) => {
    const startTime = window.performance.now();

    let response = false;

    // TODO: Show typing animation whilst awaiting response, hide before showing bot response
    this.startBotTyping();

    try {
      // TODO: Handle debug URLS - consider constants data file.
      response = await ( await fetch( '/api/alfred/webhooks/rest/webhook', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          sender,
          message
        }),
      } ) ).json();
    }
    catch( err ) {
      console.log( "Error getting response from alfred!", err );
      response = false;
    }
    
    console.log( response );

    const endTime = window.performance.now();

    const timeout = Math.floor( Math.max( 750 - ( endTime - startTime ), 0 ) );
    await delay( timeout );

    // Stop typing animation
    this.stopTyping();

    return response;
  }

  /**
   * @method appendChatMessage
   * @description Creates and appends message bubble to chat body
   * @param {string} msg 
   * @param {bool} isBot 
   */
  appendChatMessage = ( msg, isBot, timestamp = false ) => {
    if ( typeof msg !== "string" ) {
      console.warn( "Warning: chat message aborted. Attempted to append non-string message." );
      return;
    }
    else if ( !this.$messageWrapper ) {
      console.warn( "Warning: chat message aborted. Chat UI has not been properly initialized." );
      return;
    }

    const $chatBubble = $( `
<div class="al-bubble${ isBot? " bot" : "" }">
  <p class='al-message'>${ msg }</p>
  ${ timestamp 
      ? "<p class='al-timestamp'>(" + format( timestamp * 1000, "YYYY-MM-DD HH:MM") + ")</p>"
      : "" }
<div>
    ` );

    $chatBubble.insertBefore( this.$typingAnimation );
    this.scrollToBottom();
  }

  /**
   * @method appendChatButtons
   * @description 
   * @param {Object[]} buttons
   */
  appendChatButtons = ( buttons = null ) => {
    if ( Array.isArray( buttons ) && buttons.length ) {
      for ( const btn of buttons ) {
        switch( btn.type ) {
          case "web_url":
            this.appendChatMessage( `<a href="${ btn.url }" target="_blank">${ btn.title }</a>`, true );
            break;
          default:
            // TODO: on btn click, invoke this.ask( btn.title )
            this.appendChatMessage( btn.title, true );
            break;
        }
      }
    }
  }

  /**
   * @method handleChatInput
   * @description Callback handler for user input from chat window: appends user message, sends to alfred and then appends response to window.
   */
  handleChatInput = async ev => {
    ev.preventDefault && ev.preventDefault();

    // this.$input.blur();
    this.stopTyping();
    await delay( 75 );

    // Collect user message
    const userMessage = this.$input.val();

    if ( !userMessage ) {
      // No message present - abort request
      return;
    }

    this.appendChatMessage( userMessage );

    // Empty chat input
    this.$input.val( "" );

    // Get responses from BOT
    const responses = await this.ask( userMessage, this.userId );
    
    // console.log( __response );


    // Append response to chat window
    for ( const response of responses ) {
      const { text, buttons } = response;

      // Append response to chat window
      this.appendChatMessage( text, true );

      // Append buttons if returned
      if ( buttons ) {
        await delay( 333 );
        this.appendChatButtons( buttons );
      }
      
      await delay( 666 );
    }
  }

  /**
   * @method scrollToBottom
   * @description Function attempts to scroll to bottom of given container
   * @param {$} $container, defaults to message container
   */
  // scrollToBottom = ( $container = this.$messageWrapper ) => {
  scrollToBottom = ( $container = this.$body ) => {
    $container.animate( {
      scrollTop: $container[ 0 ].scrollHeight - $container[ 0 ].clientHeight
    }, 10 );
  }

}

/**
 * @function main
 * @description Initializes alfred ui application
 */
const main = async () => {
  // TODO: Initialize loader, load on click ?
  try {
    // Check alfred connection before initializing
    const { is_ready } = await ( await fetch( "/api/alfred/status" ) ).json();

    if ( !is_ready ) {
      throw new Error( "Unable to reach alfred service." )
    }
  }
  catch( err ) {
    console.warn( "Unable to connect to alfred core service." );
    return false;
  }

  // Initialize chatbot
  const chat = new Alfred();
  await chat.init();

  // TODO: Halt loader - bot enabled

  // Scroll to bottom of chat
  if ( chat.isOpen ) chat.scrollToBottom();
};

$( document ).one( 'ready', main );
