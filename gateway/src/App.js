import React, { /* Fragment, */ Component } from 'react';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import NotFound from './Views/404'
import LanguageSelect from './Views/LanguageSelect'
import Landing from './Views/Landing';
import Search from './Views/Search';
import Software from './Views/Software';
import Hardware from './Views/Hardware';
import Accounts from './Views/Accounts';
import PhoneInternet from './Views/PhoneInternet';
import ConfTV from './Views/ConfTV';
import Security from './Views/Security';
import AdaptiveTech from './Views/AdaptiveTech';
import IMServices from './Views/IMServices';
import ITServices from './Views/ITServices';
import ITServiceInterruptions from './Views/ITServiceInterruptions';
import FollowUp from './Views/FollowUp';
import OfficeRelocation from './Views/OfficeRelocation';
import SubPage from './Views/SubPage';
import SGHeader from './Components/SGHeader';
import SGFooter from './Components/SGFooter';
import Chatbot from './Components/Chatbot';

import './theme-wet-boew/css/theme.min.css';
import './gw-custom/gw-custom.css';

const base = '/:locale(en|fr)';

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
            <Route exact path="/" render={ props => ( <LanguageSelect {...props} /> )} />

            {/* BOT */}
            <Route path={ `${ base }/:view` } render={ props => <Chatbot { ...props } /> } />

            {/* HEADER */}
            <Switch>
              <Route path={ `${ base }/:view` } render={ props => (<SGHeader { ...props } { ...this.state } />) } />
            </Switch>

            {/* VIEW */}
            <Switch>
              <Route path={ `${ base }/home` } render={ props => (<Landing { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/search/:query?` } render={ props => (<Search { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/software` } render={ props => (<Software { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/hardware` } render={ props => (<Hardware { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/accounts` } render={ props => (<Accounts { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/phone-internet` } render={ props => (<PhoneInternet { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/conf-tv` } render={ props => (<ConfTV { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/security` } render={ props => (<Security { ...props } { ...this.state } />) } />
              <Route path={ `${ base }/adaptive-technologies` } render={ props => (<AdaptiveTech { ...props } />) } />
              <Route path={ `${ base }/im-services` } render={ props => (<IMServices { ...props } />) } />
              <Route path={ `${ base }/it-services` } render={ props => (<ITServices { ...props } />) } />
              <Route path={ `${ base }/follow-up` } render={ props => (<FollowUp { ...props } />) } />
              <Route path={ `${ base }/offic-reloc` } render={ props => (<OfficeRelocation { ...props } />) } />
              <Route path={ `${ base }/service-interruptions` } render={ props => (<ITServiceInterruptions { ...props } />) } />
              <Route path={ [ `${ base }/:view/:subPage` ] } render={ props => <SubPage { ...props } /> } />
              <Route path={ [ `${ base }/404`, '/:view' ] } render={ props => <NotFound { ...props } /> } />
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
