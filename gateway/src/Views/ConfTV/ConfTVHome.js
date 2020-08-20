import React, { Fragment, Component } from 'react';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

import CategoryCards from '../../Components/CategoryCards'

class ConfTVHome extends Component {

  render() {
    const { locale } = this.props.match.params;

    const queryPhoneInternetHome = gql`{
      homePages( where: { name: "conf-tv" } ) {
        header_${ locale }
        content_${ locale }
        updatedAt
        page_assets( where: { url_contains: "gw_landing_conf" } ) {
          mime
          url
        }
        sub_pages {
          name
          category
          header_${ locale }
        }
        category_tiles {
          header_${ locale }
          content_${ locale }
          sub_pages {
            header_${ locale }
            name
            parent_page
          }
        }
      }
    }`

    return (
      <Query query={ queryPhoneInternetHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : data[ `content_${ locale }` ];

          const imageLanding = !isLoaded
            ? null // TODO:
            : `http://localhost:1337${ data?.page_assets.find( asset => /gw_landing_conf_.*\.png/.test( asset?.url ) )?.url }`;

          return (
            <Fragment>
              <div className="row profile mrgn-bttm-lg">
                <div className="col-md-7">
                  <h1 property="name" id="wb-cont">{ title }</h1>                 
                  <Markdown source={ content } />
                </div>
                <div className="col-md-5 mrgn-tp-sm hidden-sm hidden-xs mrgn-tp-md">
                  <Image src={ imageLanding } alt="" className="pull-right img-responsive thumbnail" />
                </div>
              </div>
              <CategoryCards className="col-sm-6 col-md-6" locale={ locale } cards={ data?.category_tiles } />
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default ConfTVHome;
