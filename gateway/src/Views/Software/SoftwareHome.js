import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-i18n';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

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

  // Maps sub_pages' headers into card links
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
      homePages( where: { name: "software" } ) {
        header_${ locale }
        description_${ locale }
        content_${ locale }
        updatedAt
        page_assets {
          mime
          url
        }
        sub_pages {
          header_${ locale }
          category
          name
        }
      }
    }`

    return (
      <Query query={ querySearchHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : data[ `content_${ locale }` ];

          const imageSoftwareLanding = !isLoaded
            ? null // TODO:
            : `http://localhost:1337${ data.page_assets.find( asset => /gw_landing_software_.*\.png/.test( asset.url ) ).url }`;

          const newSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "SoftwareNew" )
              .map( this.mapCategoryCards)

          const supportSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "SoftwareSupport" )
              .map( this.mapCategoryCards)

          const transferSubPageLinks = !isLoaded
            ? null // TODO:
            : data.sub_pages
              .filter( page => page.category === "SoftwareTransfer" )
              .map( this.mapCategoryCards)

          return (
            <Fragment>
              <div className="row profile mrgn-bttm-lg">
                <div className="col-md-7">
                  <h1 property="name" id="wb-cont">{ title }</h1>                 
                  <Markdown source={ content } />
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
