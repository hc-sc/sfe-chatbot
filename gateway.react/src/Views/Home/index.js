import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

class Home extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.mapFeatureTiles = this.mapFeatureTiles.bind( this );
    this.mapMostRequestedServices = this.mapMostRequestedServices.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  mapFeatureTiles( tile, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      // FIXME: Cards are uneven vertically (react-bootstrap?)
      <li className="col-sm-4" key={ idx }>
        <Link to={ tile.path } className="btn btn-default btn-block well hght-inhrt">
          <div className="row">
            <div className="col-sm-12 col-xs-3">
              <Image src={ /* TODO: domain */`http://localhost:1337${ tile.icon.url }` } width="80" className="img-responsive center-block img-circle" alt=" "/>
            </div>
            <div className="col-sm-12 col-xs-9">
              <p className="mrgn-tp-sm mrgn-bttm-md">
                <strong className="h4">{ tile[ `header_${ locale }` ] }</strong>
              </p>
              <p>{ tile[ `description_${ locale }` ] }</p>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  mapMostRequestedServices( service, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <li className="list-group-item" key={ idx }>
        <Link to={ service.path }>
          <span className="glyphicon glyphicon-chevron-right"></span> { service[ `name_${ locale }` ] }
        </Link>
      </li>
    );
  }

  render() {
    const { locale } = this.props.match.params;

    const queryHome = gql`{
      home {
        title_${ locale }
        subtitle_${ locale }
        updatedAt
        featureTiles {
          header_${ locale }
          description_${ locale }
          path
          icon {
            url
            alternativeText
          }
        }
        MostRequestedServices {
          name_${ locale }
          path
        }
        logo {
          alternativeText
          url
        }
      }
    }`

    return (
      <Query query={ queryHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const featureTiles = ( loading || error )// TODO: Loading+Err handling
            ? null
            : data.home.featureTiles.map( this.mapFeatureTiles );

          const mostRequestedServices = ( loading || error )// TODO: Loading+Err handling
            ? null
            : data.home.MostRequestedServices.map( this.mapMostRequestedServices );

          return (
            <main role="main" property="mainContentOfPage" className="gw-container gw-bkg">
              <div className="gw-home-banner"> </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <div className="row gw-innerbox">
                      <Image src="http://localhost:1337/uploads/gw_logo_35b0d1e156.svg" className="img-responsive col-sm-2 col-xs-3" alt=" "/>
                      <div className="col-sm-10 col-xs-9" id="wb-sttl">
                        <h1 id="wb-cont" property="name" className="gw-home-heading"><span className="gw-banner-tagline-1"><strong>{ ( loading || error ) ? "" : data.home[ `title_${ locale }` ] }</strong></span></h1>
                        <small className="gw-banner-tagline-2">{ ( loading || error ) ? "" : data.home[ `subtitle_${ locale }` ] }</small>
                        <section id="wb-srch" className="gw-search visible-md visible-lg">
                          <h2>Search</h2>
                          <form id="gw-search-form" role="search" className="form-inline">
                            <div className="form-group">
                              <label htmlFor="gw-search">Search Service Gateway</label>
                              <input value={ this.state.searchTerm } onChange={ this.updateSearchTerm } id="gw-search" className="form-control" name="gw-search" type="search" size="27" maxLength="150" placeholder="Search Service Gateway" />
                            </div>
                            <button type="submit" id="gw-search-btn" className="btn btn-default btn-group"><span className="glyphicon-search glyphicon"></span><span className="wb-inv">Search</span></button>
                          </form>
                        </section>
                      </div>
                    </div>
                    
                    <div className="row mrgn-tp-md">
                      
                      <section id="services" className="col-md-8 gw-pdng-lft-0 gw-pdng-rght-0">
                        <h2 className="wb-invisible">Services</h2>
                        <ul className="list-unstyled row text-center wb-eqht gw-cards">
                          { featureTiles }
                        </ul>
                        <div className="text-center mrgn-bttm-md"> <a href="follow.html" className="btn btn-default btn-block mrgn-tp-0">
                          <p className="mrgn-tp-sm mrgn-bttm-sm"><strong className="h4">Service request follow-up</strong></p>
                          </a> </div>
                      </section>
                      <div className="col-md-4 gw-pdng-rght-0">
                        <section id="most-requested" className="panel panel-default">
                          <div className="panel-heading">
                            <h2 className="panel-title">Most requested services</h2>
                          </div>
                          <div>
                            <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                              { mostRequestedServices }
                            </ul>
                          </div>
                        </section>
                        <section id="interruptions" className="alert alert-info">
                          <h2 id="service-interruption-title" className="panel-title">Service interruptions</h2>
                          <div className="mrgn-tp-md">
                            <div id="MySSMBanner">No unplanned IT service interruption at this time</div>
                          </div>
                          <div className="mrgn-tp-sm"><a className="btn btn-sm btn-default" href="service-interruptions.html">IT service interruptions</a> </div>
                        </section>
                        <section id="services-other" className="gw-list-group">
                          <h2 className="h3">Other services</h2>
                          <ul className="list-unstyled">
                            <li>
                              <details data-toggle='{"print": "on"}'>
                                <summary className="well well-sm mrgn-bttm-sm">
                                  <h3 className="panel-title">Adaptive technologies</h3>
                                </summary>
                                <p className="mrgn-tp-md">Support for adaptive technologies (specialized IT software and hardware such as screen readers, alternative keyboards, voice recognition software) for employees with a disability or impairment.</p>
                                <a href="adapt-tech.html" className="btn btn-default">Continue<span className="wb-invisible">to Adaptive technologies</span></a>
                              </details>
                            </li>

                            <li>
                              <details>
                                <summary className="well well-sm mrgn-bttm-sm">
                                  <h3 className="panel-title">Branch <abbr title="Information management ">IM</abbr> services</h3>
                                </summary>
                                <p className="mrgn-tp-md">IM enabled business solutions, support, management and learning services, IM  advice and guidance.</p>
                                <a href="im-serv.html" className="btn btn-default">Continue <span className="wb-invisible">to Branch IM services</span></a>
                              </details>
                            </li>
                            <li>
                              <details>
                                <summary className="well well-sm mrgn-bttm-sm">
                                  <h3 className="panel-title">Branch <abbr title="Information technology">IT</abbr> services</h3>
                                </summary>
                                <p className="mrgn-tp-md">IT enabled business solutions, support, management and learning services, IT advice and guidance.</p>
                                <a href="it-serv.html" className="btn btn-default">Continue <span className="wb-invisible">to Branch IT services</span></a>
                              </details>
                            </li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <dl id="wb-dtmd">
                      <dt>Date modified: </dt>
                      <dd><time property="dateModified">{ ( loading || error ) ? "loading..." : data.home.updatedAt.substr(0, 10) }</time></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </main>
          );
        } }
      </Query>
    );
  }
}

export default Home;
