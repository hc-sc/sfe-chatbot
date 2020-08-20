import React, { Component } from 'react';
import { Widget } from 'rasa-webchat';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import './Chatbot.scss';

// TODO: https://github.com/botfront/rasa-webchat/issues/63


class Chatbot extends Component {
  constructor( props ) {
    super( props );

    this.onConnect = this.onConnect.bind( this );
    this.onBotUtter = this.onBotUtter.bind( this );
    this.onDisconnect = this.onDisconnect.bind( this );
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
    const { locale } = this.props.match.params;

    const queryChatbot = gql`{
      chatbot {
        title_${ locale }
        subtitle_${ locale }
        input_hint_${ locale }
      }
    }`;

    return (
      <Query query={ queryChatbot } >
        { ({ loading, error, data }) => {
          return ( loading || error || locale !== "en" /* TODO: Chatbot currently only available in English */ )
            ? null
            : data.chatbot 
              ? (
                // FIXME: Widget is causing page to crash after a while, requires localstorage clear...
                // - recent yarn upgrade may have fixed it.. haven't encountered in since 
                <Widget
                  initPayload={ "/greet" }
                  socketUrl={ "http://localhost:5005" } // TODO: Dynamic URL
                  socketPath={ "/socket.io/" }
                  title={ data.chatbot[ `title_${ locale }` ] }
                  subtitle={ data.chatbot[ `subtitle_${ locale }` ] }
                  inputTextFieldHint={ data.chatbot[ `input_hint_${ locale }` ] }
                  hideWhenNotConnected={ false }
                  showFullScreenButton={ true }
                  connectOn={ "mount" }
                  showMessageDate={ true }
                  storage={ "local" } // TODO: Allow user to toggle session/local
                  onSocketEvent={{
                    'bot_uttered': this.onBotUtter,
                    'connect': this.onConnect,
                    'disconnect': this.onDisconnect,
                  }}
                />
              )
              : null;
        } }
      </Query>
    );
  }
}

export default Chatbot;
