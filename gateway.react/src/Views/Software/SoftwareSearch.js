import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-i18n';
import ReactMarkdown from 'react-markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import {
  Image,
} from 'react-bootstrap';

class SoftwareSearch extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.mapNotes = this.mapNotes.bind( this );
    this.onSearch = this.onSearch.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  // Maps subPage headers into card links
  mapNotes( note, idx ) {
    const { locale } = this.props.match.params;
    
    return (
      <div className={ `alert alert-${ note.type }` } key={ idx }>
        <h3 className="h4">{ note[ `header_${ locale }` ] }</h3>
        <ReactMarkdown escapeHtml={ false } source={ note[ `content_${ locale }` ] } />
      </div>
    );
  }

  onSearch( e ) {
    // TODO: Implement search
    //   - No elastic plugin for strapi & graphql isn't fuzzy: integrate legacy or find something new??
    e.preventDefault();

    console.log( `-- DEBUG: Searching for '${ this.state.searchTerm }'` );
  }

  render() {
    const { locale } = this.props.match.params;

    const querySearchHome = gql`{
      page {
        software_subpages(
          where: { name: "get" }
        ) {
          category
          header_${ locale }
          content_${ locale }
          notes {
            header_${ locale }
            content_${ locale }
            type
          }
        }
      }
    }`;

    return (
      <Query query={ querySearchHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const searchPage = ( loading || error )
            ? null // TODO:
            : data.page.software_subpages[ 0 ];

          const header = ( loading || error )
            ? null // TODO:
            : searchPage[ `header_${ locale }` ];

          const content = ( loading || error )
            ? null // TODO:
            : searchPage[ `content_${ locale }` ];

          const notes = ( loading || error )
            ? null // TODO:
            : searchPage.notes.map( this.mapNotes );

          return (
            <Fragment>
              <h1 property="name" id="wb-cont">{ header }</h1>
              <div className="row">
                <div className="col-md-8 col-sm-7-col-xs-12">
                  <ReactMarkdown escapeHtml={ false } source={ content } />
                  {/* <div className="alert alert-warning">
                    <h2>Don't have Foxit yet?</h2>
                    <p>HC&nbsp;/&nbsp;PHAC are migrating from Adobe Acrobat (Standard and Professional) to Foxit PhantomPDF (“Foxit”). All employees <strong>that currently use Adobe Acrobat</strong> should have now received Foxit. <strong>If you have not received it yet, please contact the <a href="http://mysource.hc-sc.gc.ca/eng/ss/programs-services/information-management-information-technology/technical-support/information" target="_blank">IT National Service Desk</a> for support</strong>. </p>
                  </div> */}
                  <h2>Search software</h2>
                  <form onSubmit={ this.onSearch } id="swSearchForm" className="mrgn-bttm-xl mrgn-tp-md" role="form">
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
              {/* <section id="searchResultsWrapper" className="hidden">
                <h2>Search results</h2>
                <div id="searchResultsTable_wrapper" className="dataTables_wrapper no-footer"><div className="top"><div id="searchResultsTable_filter" className="dataTables_filter"><label>Filter items<input type="search" className="" placeholder="" aria-controls="searchResultsTable" /></label></div><div className="dataTables_info" id="searchResultsTable_info" role="status" aria-live="polite">Showing 0 to 0 of 0 entries</div><div className="dataTables_length" id="searchResultsTable_length"><label>Show <select name="searchResultsTable_length" aria-controls="searchResultsTable" className=""><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entries</label></div></div><table id="searchResultsTable" className="wb-tables table table-striped gw-table wb-init wb-tables-inited dataTable no-footer" aria-describedby="searchResultsTable_info" role="grid">
                  <thead>
                    <tr role="row"><th className="sorting_asc" tabindex="0" aria-controls="searchResultsTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate for descending sort" >Name<span className="sorting-cnt"><span className="sorting-icons"></span></span></th><th className="sorting" tabindex="0" aria-controls="searchResultsTable" rowspan="1" colspan="1" aria-label="Type: activate for ascending sort" >Type<span className="sorting-cnt"><span className="sorting-icons"></span></span></th><th className="no-sort sorting" tabindex="0" aria-controls="searchResultsTable" rowspan="1" colspan="1" aria-label="Details: activate for ascending sort" >Details<span className="sorting-cnt"><span className="sorting-icons"></span></span></th><th className="sorting" tabindex="0" aria-controls="searchResultsTable" rowspan="1" colspan="1" aria-label="Condition: activate for ascending sort" >Condition<span className="sorting-cnt"><span className="sorting-icons"></span></span></th><th className="no-sort sorting" tabindex="0" aria-controls="searchResultsTable" rowspan="1" colspan="1" aria-label="Action: activate for ascending sort" >Action<span className="sorting-cnt"><span className="sorting-icons"></span></span></th></tr>
                  </thead>
                <tbody><tr className=""><td valign="top" colspan="5" className="dataTables_empty">No data is available in the table</td></tr></tbody></table><div className="bottom"><div className="dataTables_paginate paging_simple_numbers" id="searchResultsTable_paginate"><ol className="pagination mrgn-tp-0 mrgn-bttm-0"><li><a className="paginate_button previous disabled" aria-controls="searchResultsTable" data-dt-idx="0" tabindex="0" id="searchResultsTable_previous" role="button" href="javascript:;">Previous</a></li><li><a className="paginate_button next disabled" aria-controls="searchResultsTable" data-dt-idx="1" tabindex="0" id="searchResultsTable_next" role="button" href="javascript:;">Next</a></li></ol></div></div><div className="clear"></div></div>
              </section>
              <section id="sw-request-modal" className="mfp-hide modal-dialog modal-content overlay-def">
                <header className="modal-header">
                  <h2 className="modal-title">Request details</h2>
                </header>
                <div className="modal-body"> </div>
                <button type="button" className="mfp-close overlay-close"> x <span className="wb-inv">(escape key)</span> </button>
              </section> */}
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default SoftwareSearch;
