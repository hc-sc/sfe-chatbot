import React, { Fragment, Component } from 'react';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import SoftwareSearchResults from './SoftwareSearchResults';
import Note from '../../Components/Note';

class SoftwareSearch extends Component {
  constructor( props ) {
    super( props );

    const { locale, query } = this.props.match.params;

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.mapNotes = this.mapNotes.bind( this );
    this.onSearch = this.onSearch.bind( this );

    this.state = {
      searchTerm: query || "",
      searchResults: query
        ? (
          <SoftwareSearchResults query={ query } locale={ locale } />
        )
        : null,
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
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

  // Handle software search
  onSearch( e ) {
    e.preventDefault();

    this.setState({
      searchResults: (
        <SoftwareSearchResults query={ this.state.searchTerm } locale={ this.props.match.params.locale } />
      ),
    })
  }

  render() {
    const { locale } = this.props.match.params;

    const querySoftwareSearch = gql`{
      homePages( where: { name: "software" } ) {
        sub_pages(
          where: { name: "get-software" }
        ) {
          category
          header_${ locale }
          content_${ locale }
          margin_notes {
            header_${ locale }
            content_${ locale }
            type
          }
        }
      }
    }`;

    return (
      <Query query={ querySoftwareSearch } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          const searchPage = data?.homePages[ 0 ]?.sub_pages[ 0 ];

          const header = !isLoaded
            ? null // TODO:
            : searchPage[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : searchPage[ `content_${ locale }` ];

          const notes = !isLoaded
            ? null // TODO:
            : searchPage.margin_notes.map( this.mapNotes );

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ header }</h1>
              <div className="row">
                <div className="col-md-8 col-sm-7-col-xs-12">
                  <Markdown source={ content } />
                  {/* <div className="alert alert-warning">
                    <h2>Don't have Foxit yet?</h2>
                    <p>HC&nbsp;/&nbsp;PHAC are migrating from Adobe Acrobat (Standard and Professional) to Foxit PhantomPDF (“Foxit”). All employees <strong>that currently use Adobe Acrobat</strong> should have now received Foxit. <strong>If you have not received it yet, please contact the <a href="http://mysource.hc-sc.gc.ca/eng/ss/programs-services/information-management-information-technology/technical-support/information" target="_blank">IT National Service Desk</a> for support</strong>. </p>
                  </div> */}
                  <h2>Search software</h2>
                  <form onSubmit={ this.onSearch } id="swSearchForm" className="mrgn-bttm-xl mrgn-tp-md">
                    <div className="form-group">
                      <label htmlFor="txtSearchSoftware">Software name or keywords</label>
                      <div className="input-group col-md-8 col-sm-8 col-xs-12">
                        <input type="text" size="40" className="form-control" onChange={ this.updateSearchTerm } value={ this.state.searchTerm } placeholder="Search pre-approved software" />
                        <span className="input-group-btn">
                          <button type="submit" className="btn btn-default">
                            <span className="glyphicon-search glyphicon"></span><span className="wb-inv">Search</span>
                          </button>
                        </span> 
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-4 col-sm-5-col-xs-12">
                  { notes }
                </div>
              </div>
              { this.state.searchResults }
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default SoftwareSearch;
