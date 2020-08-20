// Fallback to render generic components of non-specialized sub-pages, redirect to 404 if quey fails.

import React, { Fragment, Component } from 'react';
import Markdown from '../../Components/Markdown';
import { Redirect } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import Note from '../../Components/Note';
import Tabs from '../../Components/Tabs';
import Panels from '../../Components/Panels';

class SubPage extends Component {
  constructor( props ) {
    super( props );

    this.mapNotes = this.mapNotes.bind( this );
    this.mapActions = this.mapActions.bind( this );
  }

  // Maps subPage headers into card links
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

  // Maps actions into buttons
  mapActions( action, idx ) {
    const { locale, } = this.props.match.params;

    const header = action[ `content_${ locale }` ] && (
      <h3>{ action[ `header_${ locale }` ] }</h3>
    );
    const content = action[ `content_${ locale }` ] && (
      <Markdown source={ action[ `content_${ locale }` ] } />
    );

    const button = action[ `label_${ locale }` ] && (
      <a href={ action[ `link_${ locale }` ] } target="_blank" className="btn btn-primary">
        { action[ `label_${ locale }` ] }
      </a>
    );

    return(
      <Fragment key={ idx }>
        { header }
        { content }
        <br />
        { button }
      </Fragment>
    );
  }
  
  render() {
    const { locale, /* view, */ subPage } = this.props.match.params;

    const querySubpage = gql`{
      subPages( where: { name: "${ subPage }" } ) {
        category
        header_${ locale }
        content_${ locale }
        TabStyle
        tabs {
          name
          header_${ locale }
          content_${ locale }
          actions {
            header_${ locale }
            content_${ locale }
            label_${ locale }
            link_${ locale }
          }
          notes {
            header_${ locale }
            content_${ locale }
            type
          }
        }
        actions {
          header_${ locale }
          content_${ locale }
          label_${ locale }
          link_${ locale }
        }
        margin_notes {
          header_${ locale }
          content_${ locale }
          type
        }
      }
    }`;

    return(
      <Query query={ querySubpage } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {
          const isLoaded = ( !loading && !error && data );

          if ( isLoaded && data.subPages?.length !== 1 ) {
            console.log( data.subPages )
            // Page not found
            return (
              <Redirect to="/404" />
            );
          }

          const subPage = !isLoaded
            ? null // TODO:
            : data.subPages[ 0 ];

          const header = !isLoaded
            ? null // TODO:
            : subPage[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : subPage[ `content_${ locale }` ];

          const notes = !isLoaded
            ? null // TODO:
            : subPage.margin_notes.map( this.mapNotes );

          const tabs = !isLoaded
            ? null // TODO:

            // Render tabs or panels depending on style
            : /panel/i.test( subPage.TabStyle )
              ? (
                <Panels
                  locale={ locale }
                  panels={ subPage.tabs }
                />
              )
              : (
                <Tabs
                  locale={ locale }
                  tabs={ subPage.tabs }
                />
              );


          const actions = !isLoaded
            ? null // TODO:
            : subPage.actions.map( this.mapActions );

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ header }</h1>
              <div className="row">
                <div className={ `col-md-${ notes?.length ? "8" : "12" } col-sm-${ notes?.length ? "7" : "12" } col-xs-12` } >
                  <Markdown source={ content } />
                  { tabs }
                  <div>
                    { actions }
                  </div>
                </div>
                <div className={ `col-md-${ notes?.length ? "4" : "12" } col-sm-${ notes?.length ? "5" : "12" } col-xs-12` } >
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

export default SubPage;