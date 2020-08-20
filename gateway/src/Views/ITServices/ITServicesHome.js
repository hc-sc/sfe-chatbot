import React, { Fragment, Component } from 'react';
import Panels from '../../Components/Panels';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';


class ITServicesHome extends Component {
  constructor( props ) {
    super( props );

    this.mapPanelGroups = this.mapPanelGroups.bind( this );
  }

  mapPanelGroups( panels, idx ) {
    const { locale } = this.props.match.params;
    
    return(
      <Fragment key={ idx }>
        <h2>{ panels[ `header_${ locale }` ] }</h2>
        <Panels locale={ locale } panels={ panels.tabs } />
      </Fragment>
    );
  }

  render() {
    const { locale } = this.props.match.params;

    const queryITSHome = gql`{
      homePages( where: { name: "it-services" } ) {
        name
        header_${ locale }
        tab_groups {
          header_${ locale }
          tabs {
            name
            header_${ locale }
            content_${ locale }
          }
        }
      }
    }`

    return (
      <Query query={ queryITSHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const panels = !isLoaded
          ? null // TODO:
          : data?.tab_groups.map( this.mapPanelGroups );

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ title }</h1>                 
              { panels }
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default ITServicesHome;
