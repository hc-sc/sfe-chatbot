import React, { Fragment, Component } from 'react';
import Panels from '../../Components/Panels';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';


class IMServicesHome extends Component {
  render() {
    const { locale } = this.props.match.params;

    const queryIMSHome = gql`{
      homePages( where: { name: "im-services" } ) {
        name
        header_${ locale }
        tab_groups {
          tabs {
            header_${ locale }
            content_${ locale }
            name
          }
        }
      }
    }`

    return (
      <Query query={ queryIMSHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const tabs = !isLoaded
            ? null // TODO:
            : (
              <Panels locale={ locale } panels={ data?.tab_groups[ 0 ].tabs } />
            );

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ title }</h1>                 
              { tabs }
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default IMServicesHome;
