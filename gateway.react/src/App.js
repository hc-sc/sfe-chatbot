import React, { Fragment, Component } from 'react';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import Landing from './Views/Landing'
import Home from './Views/Home';
import Software from './Views/Software';
import SGHeader from './Components/SGHeader';
import SGFooter from './Components/SGFooter';
import Chatbot from './Components/Chatbot';

import './theme-wet-boew/css/theme.min.css';
import './gw-custom/gw-custom.css';

const base = '/:locale(en|fr)?';


class App extends Component {
  constructor( props ) {
    super( props );

    this.client = new ApolloClient({ uri: 'http://localhost:1337/graphql' }); // TODO: URI

    this.state = {
      currentUser: {
        // TODO: Authenticate using JWT with strapi. Useful for editing pages, viewing problems?
        session: true, // forget user
        username: "",
        jwt: false,
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Router>

          <ApolloProvider client={ this.client } >

            {/* ROOT, LANGUAGE SELECTION TODO: Persist language and redirect */}
            <Route exact path="/" render={ props => ( <Landing {...props} /> )} />

            {/* BOT */}
            <Route path={ `${ base }/:view` } component={ Chatbot } />

            {/* HEADER */}
            <Switch>
              <Route path={ `${ base }/:view` } render={ props => (<SGHeader { ...props } { ...this.state } />) } />
            </Switch>

            {/* VIEW */}
            <Switch>
              <Route path={ `${ base }/home` } render={ props => (<Home { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/software` } render={ props => (<Software { ...props } { ...this.state } />) } />
            </Switch>

            {/* FOOTER */}
            <Switch>
              <Route path={ `${ base }/:view` } render={ props => (<SGFooter { ...props } { ...this.state } />) } />
            </Switch>

          </ApolloProvider>

        </Router>

      </div>
    );
  }
}

export default App;
