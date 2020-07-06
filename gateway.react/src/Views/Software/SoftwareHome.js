import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-i18n';
import ReactMarkdown from 'react-markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

import ReportAProblem from '../../Components/ReportAProblem';

class SoftwareHome extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.mapCategoryCards = this.mapCategoryCards.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  // Maps software_subpages' headers into card links
  mapCategoryCards( card, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <li className="list-group-item" key={ idx } >
        <Link to={ `/software/${ card.name }` }>
          <span className="glyphicon glyphicon-chevron-right"></span> { card[ `header_${ locale }` ] }
        </Link>
      </li>
    );
  }

  render() {
    const { locale } = this.props.match.params;

    const querySearchHome = gql`{
      page {
        title_${ locale }
        description_${ locale }
        content_${ locale }
        updatedAt
        page_assets {
          mime
          url
        }
        software_subpages {
          header_${ locale }
          category
          name
        }
      }
    }`

    return (
      <Query query={ querySearchHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          // console.log( data );

          const title = ( loading || error )
            ? null // TODO:
            : data.page[ `title_${ locale }` ];

          const content = ( loading || error )
            ? null // TODO:
            : data.page[ `content_${ locale }` ];

          const imageSoftwareLanding = ( loading || error )
            ? null // TODO:
            : `http://localhost:1337${ data.page.page_assets.find( asset => /gw_landing_software_.*\.png/.test( asset.url ) ).url }`;

          const newSubPageLinks = ( loading || error )
            ? null // TODO:
            : data.page.software_subpages
              .filter( page => page.category === "New" )
              .map( this.mapCategoryCards)

          const supportSubPageLinks = ( loading || error )
            ? null // TODO:
            : data.page.software_subpages
              .filter( page => page.category === "Support" )
              .map( this.mapCategoryCards)

          const transferSubPageLinks = ( loading || error )
            ? null // TODO:
            : data.page.software_subpages
              .filter( page => page.category === "Transfer" )
              .map( this.mapCategoryCards)

          return (
            <Fragment>
              <div className="row profile mrgn-bttm-lg">
                <div className="col-md-7">
                  <h1 property="name" id="wb-cont">{ title }</h1>                 
                  <ReactMarkdown source={ content } />
                </div>
                <div className="col-md-5 mrgn-tp-sm hidden-sm hidden-xs mrgn-tp-md">
                  <Image src={ imageSoftwareLanding } alt="" className="pull-right img-responsive thumbnail" />
                </div>
              </div>
              <div className="row wb-eqht">
                <div className="col-sm-12 col-md-4">
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title" id="soft-new">New software</h2>
                    </div>
                    <div className="panel-body">
                      <p>Get software / applications that  are required to meet business needs</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { newSubPageLinks }
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="col-sm-6 col-md-4">
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title" id="soft-support">Software support</h2>
                    </div>
                    <div className="panel-body">
                      <p>Basic troubleshooting to support you when a software product is not performing to your needs or expectations</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { supportSubPageLinks }
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="col-sm-6 col-md-4">
                  <section className="panel panel-default hght-inhrt">
                    <div className="panel-heading">
                      <h2 className="panel-title" id="soft-transfer">Software transfer</h2>
                    </div>
                    <div className="panel-body">
                      <p>Transfer of software licenses that are no longer being used</p>
                      <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
                        { transferSubPageLinks }
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

export default SoftwareHome;
