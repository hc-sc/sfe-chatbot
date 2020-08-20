import React, { Fragment/* , Component */ } from 'react';
import { /* useRouteMatch, */ Route, Switch  } from 'react-router-dom';
import { Link, NavLink } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

import SGHeaderDropdown from './SGHeaderDropdown';
import SearchBar from './SearchBar';

import './SGHeader.scss';

const SGHeader = props => {

  // const { path } = useRouteMatch();
  const { location } = props;
  const { locale, view } = props.match.params;

  const queryHeader = gql`{
    home {
      title_${ locale }
      subtitle_${ locale }
      featureTiles {
        header_${ locale }
        header_short_${ locale }
        path
        sub_pages {
          name
          header_${ locale }
          category
        }
      }
      logo {
        alternativeText
        url
      }
    }
    subPages {
      name
      header_${ locale }
      category
      parent_page
    }
  }`;

  const mapMenuDropdowns = ( button, idx ) => {
    return(
      <SGHeaderDropdown
        key={ idx }
        locale={ locale }
        location={ location }
        all={ button.path }
        header={ button[ `header_short_${ locale }` ] || button[ `header_${ locale }` ] }
        pages={ button.sub_pages }
        active={ button.path.includes( view ) }
      />
    );
  };

  return (
    <Query query={ queryHeader } pollInterval={ 0 } >
      { ({ loading, error, data }) => {

        const bannerImg = ( loading || error )// TODO: Loading+Err handling
          ? ""
          : `http://localhost:1337${ data.home.logo.url }`;

        const dropdowns = ( loading || error )
          ? null
          : data.home.featureTiles
            .map( tile => { // FIXME: can probably organize featured tiles better and avoid this mess. 
              // For current feature, replace the featured subpages with all related subpages for menu dropdown
              return Object.assign( {}, tile, {
                sub_pages: data.subPages.filter( page => tile.path.replace(/[^\w\s]/gi, '') === page.parent_page ) 
              } );                                   // ^^ Strapi enums don't accept special characters. ^^
            } ) 
            .map( mapMenuDropdowns );

        return(
          <Fragment>
            <ul id="wb-tphp">
              <li className="wb-slc"> <a className="wb-sl" href="#wb-cont">Skip to main content</a></li>
            </ul>
            <header role="banner">
              <div className={ view === "home" ? "wb-bnr" : "gw-banner" }>
                <div id="wb-bnr">
                  <div id="wb-bar">
                    <div className="container">
                      <div className="row">
                        <section id="wb-lng" className="visible-md visible-lg">
                          <h2>Language selection</h2>
                          <ul className="text-right">
                            <li className={ locale === "fr" ? "curr" : "" }>
                              <NavLink lang="fr" ignoreLocale to={ window.location.pathname.replace( /\/(?:fr|en)(?=\/|$)/, `/${ "fr" }` ) } >Français{ locale === "fr" ? ( <span>&#32;(current)</span> ) : "" }</NavLink>
                            </li>
                            <li className={ locale === "en" ? "curr" : "" }>
                              <NavLink lang="en" ignoreLocale to={ window.location.pathname.replace( /\/(?:fr|en)(?=\/|$)/, `/${ "en" }` ) } >English{ locale === "en" ? ( <span>&#32;(current)</span> ) : "" }</NavLink>
                            </li>
                          </ul>
                        </section>
                        <section className="wb-mb-links col-xs-12 visible-sm visible-xs" id="wb-glb-mn">
                          <h2>Search and menus</h2>
                          <ul className="pnl-btn list-inline text-right">
                            <li><a href="#mb-pnl" title="Search and menus" aria-controls="mb-pnl" className="overlay-lnk btn btn-sm btn-default" role="button"><span className="glyphicon glyphicon-search"><span className="glyphicon glyphicon-th-list"><span className="wb-inv">Search and menus</span></span></span></a></li>
                          </ul>
                          <div id="mb-pnl"></div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                { /* bannerContent */ }
                <Switch>
                  <Route path={ `/:locale(en|fr)/home` } render={ () => <nav role="navigation" id="wb-sm" data-trgt="mb-pnl" className="wb-menu visible-md visible-lg" typeof="SiteNavigationElement"> </nav> } />
                  <Route path={ `/:locale(en|fr)/:view` } render={ () => (
                    <Fragment>
                      <div className="container">
                        <div className="row">
                          <div id="wb-sttl" className="col-md-7 gw-pdng-lft-0">
                            <Link to="/home">
                              <Image src={ bannerImg } alt="" className="gw-logo" />
                              <span className="gw-banner-tagline-1">Service Gateway<span className="wb-inv">, </span> <small className="gw-banner-tagline-2">Supporting IM/IT service delivery</small></span>
                            </Link>
                          </div>
                          <SearchBar { ...props } />
                        </div>
                      </div>
                    </Fragment>
                  ) } />
                </Switch>
              </div>
              <nav role="navigation" id="wb-sm" className="wb-menu visible-md visible-lg gw-banner-menu" typeof="SiteNavigationElement">
                {/* { navContent } */}
                <Switch>
                  <Route path={ `/:locale(en|fr)/home` } render={ () => <div></div> } />
                  <Route path={ `/:locale(en|fr)/:view` } render={ () => (
                    <div className="container nvbar">
                      <h2>Topics menu</h2>
                      <div className="row">
                        <ul className="list-inline menu gw-sitemenu" role="menubar">
                          <li className="gw-bnr-home">
                            <Link to="/home" className="gw-bnr-lnk-home" tabIndex="0" aria-posinset="1" aria-setsize="7" role="menuitem">
                              <span className="glyphicon glyphicon-home gw-icon-md" title="Service Passerelle - acceuil"></span> <span className="wb-inv">Service Passerelle - acceuil</span>
                            </Link>
                          </li>
                          { dropdowns }
                        </ul>
                      </div>
                    </div>
                  ) } />
                </Switch>
              </nav>
            </header>
          </Fragment>
        );
      }}
    </Query>
  );
}

export default SGHeader;
