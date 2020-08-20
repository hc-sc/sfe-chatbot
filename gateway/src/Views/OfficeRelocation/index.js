import React, { Component } from 'react';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import ReportAProblem from '../../Components/ReportAProblem';


class OfficeRelocation extends Component {
  render() {
    const { locale } = this.props.match.params;

    const queryITSIHome = gql`{
      homePages( where: { name: "offic-reloc" } ) {
        header_${ locale }
        content_${ locale }
      }
    }`

    return (
      <Query query={ queryITSIHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : (
              <Markdown source={ data[ `content_${ locale }` ] } />
            );

          return (
            <main role="main" property="mainContentOfPage" className="container gw-container"> 
              <h1 property="name" id="wb-cont">{ title }</h1>

              { content }

              <ReportAProblem { ...this.props } />
            </main>
          );
        } }
      </Query>
    );
  }
}

export default OfficeRelocation;
