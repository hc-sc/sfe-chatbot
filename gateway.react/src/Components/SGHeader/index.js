import React, { Fragment, Component } from 'react';
import { Link, NavLink } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

class SGHeader extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      lang: this.props.lang || "en",
    }
  }

  // TODO: Searchbar

  render() {
    
    const { locale, view } = this.props.match.params;

    const queryHome = gql`{
      home {
        title_${ locale }
        subtitle_${ locale }
        featureTiles {
          header_${ locale }
          description_${ locale }
          path
          icon {
            url
            alternativeText
          }
        }
        logo {
          alternativeText
          url
        }
      }
    }`;

    console.log( `Navigation: '${ view }'` );

    return (
      <Query query={ queryHome } pollInterval={ 0 } >
        { ({ loading, error, data }) => {

          let bannerContent = null;
          let navContent = null;

          // View
          switch( view ) {
            
            case( "home" ):
              bannerContent = (
                <Fragment>
                  <nav role="navigation" id="wb-sm" data-trgt="mb-pnl" className="wb-menu visible-md visible-lg" typeof="SiteNavigationElement"> </nav>
                </Fragment>
              );
            break;

            case( "software" ):

              const bannerImg = ( loading || error )// TODO: Loading+Err handling
              ? ""
              : `http://localhost:1337${ data.home.logo.url }`;
              

              bannerContent = (
                <Fragment>
                  <div className="container">
                    <div className="row">
                      <div id="wb-sttl" className="col-md-7 gw-pdng-lft-0">
                        <Link to="/home">
                          <Image src={ bannerImg } alt="" className="gw-logo" />
                          <span className="gw-banner-tagline-1">Service Gateway<span className="wb-inv">, </span> <small className="gw-banner-tagline-2">Supporting IM/IT service delivery</small></span>
                        </Link>
                      </div>
                      <section id="wb-srch" className="col-md-5 visible-md visible-lg">
                        <h2>Search</h2>
                        <form onSubmit={ () => console.log( "TODO: implement searchbar form" ) } id="gw-search-form" role="search" className="form-inline">
                          <div className="form-group">
                            <label htmlFor="gw-search">Search Service Gateway</label>
                            <input id="gw-search" className="form-control" name="gw-search" type="search" size="27" maxLength="150" placeholder="Search Service Gateway" />
                          </div>
                          <button type="submit" id="gw-search-btn" className="btn btn-default btn-sm"> <span className="glyphicon-search glyphicon"></span><span className="wb-inv">Search</span> </button>
                        </form>
                      </section>
                    </div>
                  </div>
                </Fragment>
              );

              navContent = (
                <div className="container nvbar">
                  <h2>Topics menu</h2>
                  <div className="row">
                    <ul className="list-inline menu">
                      <li><a href="home.html"><span className="glyphicon glyphicon-home"></span> Service Gateway home</a></li>
                      <li><a href="software.html">Software</a></li>
                      <li><a href="hardware.html">Hardware</a></li>
                      <li><a href="accounts.html">IT accounts  access</a></li>
                      <li><a href="phone.html">Phone and internet</a></li>
                      <li><a href="conf-tv.html">Conference and TV</a></li>
                      <li><a href="security.html">Security</a></li>
                    </ul>
                  </div>
                </div>
              );
            break;
          }

          return(
            <Fragment>
              <ul id="wb-tphp">
                <li className="wb-slc"> <a className="wb-sl" href="#wb-cont">Skip to main content</a></li>
              </ul>
              <header role="banner">
                <div className={ view !== "home" ? "gw-banner" : "wb-bnr" }>
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
                  { bannerContent }
                </div>
                {/* TODO: I think WET is updateing menu HTML - look that up and re-implement */}
                <nav role="navigation" id="wb-sm" data-ajax-replace="../ajax/sitemenu-en.html" data-trgt="mb-pnl" className="wb-menu visible-md visible-lg gw-banner-menu" typeof="SiteNavigationElement">  
                  { navContent }
                </nav>
              </header>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default SGHeader;
