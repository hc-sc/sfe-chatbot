import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-i18n';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Button,
  Image,
} from 'react-bootstrap';

import './LanguageSelect.scss';

class LanguageSelect extends Component {
  render() {
    const queryLanguageSelect = gql`{
      languageSelection {
        banner {
          url
          alternativeText
        }
      }
    }`

    return(
      <Query query={ queryLanguageSelect } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data.languageSelection );

          const bannerImg = !isLoaded
            ? null
            : <Image src={ `http://localhost:1337${ data.languageSelection.banner.url }` } alt={ data.languageSelection.banner.alternativeText } />;

          return(
            <Fragment>
              <header role="banner" className="gw-banner-splash">
                <div className="container">
                  <div className="row mrgn-tp-lg mrgn-bttm-lg">
                    <div className="col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                      <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                          { bannerImg }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <main role="main" property="mainContentOfPage" className="gw-container container-fluid gw-container-splash">
                <div className="row mrgn-tp-lg gw-splash-out-box">
                  <div className="col-md-8 col-md-offset-2 gw-splash-inner">
                    <div className="row mrgn-tp-lg mrgn-bttm-xl">
                      <section className="col-md-6 " lang="en">
                        <h1 className="text-center">Service Gateway</h1>
                        <p className="h4 text-info text-center mrgn-tp-0 mrgn-bttm-lg">Supporting IM/IT service delivery</p>
                        {/* <Button block bsStyle="primary" bsSize="large" href="./en" onClick={ () => {  this.props.setLang( "en" ) } }> */}
                        <NavLink ignoreLocale to={ "/en/home" }>
                          <Button block bsStyle="primary" bsSize="large">
                            English
                          </Button>
                        </NavLink>
                      </section>
                      <section className="col-md-6" lang="fr">
                        <h1 className="text-center" lang="fr">Service Passerelle </h1>
                        <p className="h4 text-info text-center mrgn-tp-0 mrgn-bttm-lg">Soutenir la prestation de services de GI/TI</p>
                        <NavLink ignoreLocale to={ "/fr/home" }>
                          <Button block bsStyle="primary" bsSize="large">
                            Français
                          </Button>
                        </NavLink>
                      </section>
                    </div>
                  </div>
                </div>
              </main>
            </Fragment>
          );
        }} 
      </Query>
    );
  }
}

export default LanguageSelect;