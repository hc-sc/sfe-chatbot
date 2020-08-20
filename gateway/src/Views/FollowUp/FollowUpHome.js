import React, { Fragment, Component } from 'react';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import Note from '../../Components/Note';

class FollowUpHome extends Component {
  constructor( props ) {
    super( props );

    this.mapNotes = this.mapNotes.bind( this );
  }

  mapNotes( note, idx ) {
    const { locale, } = this.props.match.params;
    
    return (
      <Note
        key={ idx }
        type={ note.type }
        header={ note[ `header_${ locale }` ] }
        content={ note[ `content_${ locale }` ] }
      />
    );
  }

  render() {
    const { locale } = this.props.match.params;

    const queryFollowUpHome = gql`{
      homePages( where: { name: "follow-up" } ) {
        header_${ locale }
        content_${ locale }
        notes {
          header_${ locale }
          content_${ locale }
          type
        }
      }
    }`;

    return (
      <Query query={ queryFollowUpHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : data[ `content_${ locale }` ];


          const notes = !isLoaded
            ? null // TODO:
            : data?.notes.map( this.mapNotes );
            
          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ title }</h1>                 
              <div className="row profile mrgn-bttm-lg">
                <div className="col-md-8 col-sm-7 col-xs-12">
                  <Markdown source={ content } />
                </div>
                <div className="col-md-4 col-sm-5 col-xs-12">
                  { notes }
                </div>
              </div>
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default FollowUpHome;
