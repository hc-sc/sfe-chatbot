import React, { /* Fragment, */ Component } from 'react';
import { Widget } from 'rasa-webchat';

import './Chatbot.scss';

class Chatbot extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      
    }
  }

  onConnect() {
    console.log('bot connection established');

    // TODO: Create user, authenticate (?)
  }

  onBotUtter() {
    console.log('the bot said something');
  }

  onDisconnect() {
    console.log('bot connection lost');
  }

  render() {
    return (
      // <div></div>
      <Widget 
        // embedded={ true }
        initPayload={ "/get_started" }
        socketUrl={ "http://localhost:5005" } // TODO: Dynamic URL
        socketPath={ "/socket.io/" }
        title={ "HC Virtual Assistant" }
        subtitle={ "Alfred" }
        hideWhenNotConnected={ false }
        connectOn={ "open" }
        showMessageDate={ "true" }
        storage={ "session" } // TODO: Allow user to toggle session/local
        onSocketEvent={{
          'bot_uttered': this.onBotUtter,
          'connect': this.onConnect,
          'disconnect': this.onDisconnect,
        }}
      />
    );
  }
}

export default Chatbot;
