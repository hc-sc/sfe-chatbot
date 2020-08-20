import React, { /* Fragment, */ Component } from 'react';
import { Link } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import Markdown from '../../Components/Markdown';

import {
  Image,
} from 'react-bootstrap';

import ServiceInterruptionsWidget from '../../Components/ServiceInterruptionsWidget';

import './Home.scss';

class Home extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.onSearch = this.onSearch.bind( this );
    this.mapFeatureTiles = this.mapFeatureTiles.bind( this );
    this.mapMostRequestedPages = this.mapMostRequestedPages.bind( this );
    this.mapOtherServices = this.mapOtherServices.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  onSearch( e ) {
    e.preventDefault();
    const { locale } = this.props.match.params;
    this.props.history.push( `/${ locale }/search/${ encodeURIComponent( this.state.searchTerm ) }` );
  }

  mapFeatureTiles( tile, idx ) {
    const { locale } = this.props.match.params;
    
    return (
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
              <Markdown source={ tile[ `content_${ locale }` ] } />
            </div>
          </div>
        </Link>
      </li>
    );
  }

  mapMostRequestedPages( service, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <li className="list-group-item" key={ idx }>
        <Link to={ `/${ service.parent_page }/${ service.name }` }>
          <span className="glyphicon glyphicon-chevron-right"></span> { service[ `header_${ locale }` ] }
        </Link>
      </li>
    );
  }

  mapOtherServices( service, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <li key={ idx }>
        <details data-toggle='{"print": "on"}'>
          <summary className="well well-sm mrgn-bttm-sm">
          <h3 className="panel-title">{ service[ `header_${ locale }` ] }</h3>
          </summary>
          <p className="mrgn-tp-md">{ service[ `description_${ locale }` ] }</p>
          <Link className="btn btn-default" to={ `/${ service.name }` }>
            Continue<span className="wb-invisible">to Adaptive technologies</span>
          </Link>
        </details>
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
          content_${ locale }
          path
          icon {
            url
            alternativeText
          }
        }
        MostRequestedPages {
          name
          parent_page
          header_${ locale }
        }
        OtherServices {
          name
          header_${ locale }
          description_${ locale }
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

          const isLoaded = ( !loading && !error && data.home );

          const featureTiles = !isLoaded// TODO: Loading+Err handling
            ? null
            : data.home.featureTiles.map( this.mapFeatureTiles );

          const mostRequestedServices = !isLoaded// TODO: Loading+Err handling
            ? null
            : data.home.MostRequestedPages?.map( this.mapMostRequestedPages );

          const otherServices = !isLoaded// TODO: Loading+Err handling
            ? null
            : data.home.OtherServices?.map( this.mapOtherServices );

          return (
            // FIXME: Some i18n missing
            <main role="main" property="mainContentOfPage" className="gw-container gw-bkg">
              <div className="gw-home-banner"> </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-10 col-sm-offset-1">
                    <div className="row gw-innerbox">
                      <Image src="http://localhost:1337/uploads/gw_logo_35b0d1e156.svg" className="img-responsive col-sm-2 col-xs-3" alt=" "/>
                      <div className="col-sm-10 col-xs-9" id="wb-sttl">
                        <h1 id="wb-cont" property="name" className="gw-home-heading"><span className="gw-banner-tagline-1"><strong>{ isLoaded && data.home[ `title_${ locale }` ] }</strong></span></h1>
                        <small className="gw-banner-tagline-2">{ isLoaded && data.home[ `subtitle_${ locale }` ] }</small>
                        <section id="wb-srch" className="gw-search visible-md visible-lg">
                          <h2>Search</h2>
                          <form onSubmit={ this.onSearch } id="gw-search-form" role="search" className="form-inline">
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
                        <div className="text-center mrgn-bttm-md">
                          <Link to={"/follow-up"} className="btn btn-default btn-block mrgn-tp-0">
                            <p className="mrgn-tp-sm mrgn-bttm-sm"><strong className="h4">Service request follow-up</strong></p>
                          </Link>
                        </div>
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
                        
                        <ServiceInterruptionsWidget { ...this.props } />

                        <section id="services-other" className="gw-list-group">
                          <h2 className="h3">Other services</h2>
                          <ul className="list-unstyled">
                            { otherServices }
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
                      <dd><time property="dateModified">{ !isLoaded ? "loading..." : data.home.updatedAt.substr(0, 10) }</time></dd>
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
