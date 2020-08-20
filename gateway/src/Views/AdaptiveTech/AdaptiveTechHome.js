import React, { Fragment, Component } from 'react';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

class AdaptiveTechHome extends Component {
  render() {
    const { locale } = this.props.match.params;

    const queryATHome = gql`{
      homePages( where: { name: "adaptive-technologies" } ) {
        header_${ locale }
        content_${ locale }
      }
    }`

    return (
      <Query query={ queryATHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : data[ `content_${ locale }` ];

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ title }</h1>                 
              <Markdown source={ content } />
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default AdaptiveTechHome;
