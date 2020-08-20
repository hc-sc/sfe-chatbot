import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-i18n';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

class HardwareHome extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.mapCategoryCards = this.mapCategoryCards.bind( this );
    this.mapCollapseTabs = this.mapCollapseTabs.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  // Maps sub_pages' headers into card links
  mapCategoryCards( card, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <li className="list-group-item" key={ idx } >
        <Link to={ `/hardware/${ card.name }` }>
          <span className="glyphicon glyphicon-chevron-right"></span> { card[ `header_${ locale }` ] }
        </Link>
      </li>
    );
  }

  // Map tab content
  mapCollapseTabs( tab, idx ) {
    const { locale } = this.props.match.params;

    return(
      <li key={ idx }>
        <details>
          <summary>
            <h2 className="h4">{ tab[`header_${ locale }` ] }</h2>
          </summary>
          <Markdown source={ tab[ `content_${ locale }` ] } />
        </details>
      </li>
    );
  }

  render() {
    const { locale } = this.props.match.params;

    const queryHardwareHome = gql`{
      homePages( where: { name: "hardware" } ) {
        header_${ locale }
        content_${ locale }
        updatedAt
        tab_groups {
          tabs {
            header_${ locale }
            content_${ locale }
            name
          }
        }
        page_assets( where: { url_contains: "gw_landing_hardware" } ) {
          mime
          url
        }
        sub_pages {
          name
          category
          header_${ locale }
        }
      }
    }`

    return (
      <Query query={ queryHardwareHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : data[ `content_${ locale }` ];

          const collapseTabs = !isLoaded
            ? null // TODO:
            : data?.tab_groups[ 0 ].tabs.map( this.mapCollapseTabs );

          const imageHardwareLanding = !isLoaded
            ? null // TODO:
            : `http://localhost:1337${ data.page_assets.find( asset => /gw_landing_hardware_.*\.png/.test( asset?.url ) )?.url }`;

          const getSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "Get" )
              .map( this.mapCategoryCards)

          const installSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "Install" )
              .map( this.mapCategoryCards)
              
          const supportSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "Support" )
              .map( this.mapCategoryCards)
          
          const returnSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "Return" )
              .map( this.mapCategoryCards)

          return (
            <Fragment>
              <div className="row profile mrgn-bttm-lg">
                <div className="col-md-7">
                  <h1 property="name" id="wb-cont">{ title }</h1>                 
                  <Markdown source={ content } />
                  <ul className="list-unstyled">
                    { collapseTabs }
                  </ul>
                </div>
                <div className="col-md-5 mrgn-tp-sm hidden-sm hidden-xs mrgn-tp-md">
                  <Image src={ imageHardwareLanding } alt="" className="pull-right img-responsive thumbnail" />
                </div>
              </div>
              <div className="row wb-eqht wb-init wb-eqht-inited" id="wb-auto-1">
                <p className="mrgn-bttm-lg col-md-12" style={{ verticalAlign: "top", minHeight: "24px" }}>This service supports hardware acquisition, installation, support and disposal in accordance with HC&nbsp;/&nbsp;PHAC technology standards.</p>
                <div className="col-sm-6 col-md-6" style={{ verticalAlign: "top", minHeight: "302px" }}> 
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title">Get hardware</h2>
                    </div>
                    <div className="panel-body">
                      <p>Request <a href="#expand-equip-addit"><strong>additional</strong> IT equipment</a>, and <a href="#expand-print">printers</a> (including leases) and find information on how to get <a href="#expand-accessories">computer accessories</a>.</p>
                      <p>Note that Primary IT equipment is requested through the <a href="a-new-user.html">New or returning user set-up</a>.</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { getSubPageLinks }                        
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="col-sm-6 col-md-6" style={{ verticalAlign: "top", minHeight: "302px" }}>
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title" id="h-install">Hardware installation</h2>
                    </div>
                    <div className="panel-body">
                      <p>Installation and configuration of IT equipment such as computers, monitors, scanners, other devices and printers.</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { installSubPageLinks }
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="col-sm-6 col-md-6" style={{ verticalAlign: "top", minHeight: "267px" }}>
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title">Hardware support</h2>
                    </div>
                    <div className="panel-body">
                      <p>Get support for any IT equipment such as computers, monitors, portable storage devices (PSD), tablets, scanners, fax machines, and computer accessories.</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { supportSubPageLinks }
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="col-sm-6 col-md-6" style={{ verticalAlign: "top", minHeight: "267px" }}>
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title">Hardware return</h2>
                    </div>
                    <div className="panel-body">
                      <p>Return any IT equipment such as computers, monitors, portable storage devices (PSD), tablets, scanners, fax machines, and computer accessories.</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { returnSubPageLinks }
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default HardwareHome;
