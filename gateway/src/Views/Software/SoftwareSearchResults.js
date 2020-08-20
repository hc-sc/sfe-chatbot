import React, { Fragment, Component } from 'react';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import MUIDataTable from "mui-datatables";
import PropagateLoader from 'react-spinners/PropagateLoader';

class SoftwareSearchResults extends Component {
  constructor( props ) {
    super( props );

    this.mapSoftwareCell = this.mapSoftwareCell.bind( this );
    this.mapTypeCell = this.mapTypeCell.bind( this );
    this.mapDetailsCell = this.mapDetailsCell.bind( this );
    this.mapCostCell = this.mapCostCell.bind( this );
    this.mapActionCell = this.mapActionCell.bind( this );
  }

  mapSoftwareCell( row ) {
    return(
      <div>
        <dl className="dl-horizontal brdr-0">
          { row._source.shortName 
            ? (
              <Fragment>
                <h4>Name</h4>
                <p>{ row._source.shortName }</p>
              </Fragment>
            ) 
            : null 
          }
          { row._source.version 
            ? (
              <Fragment>
                <h4>Version</h4>
                <p>{ row._source.version }</p>
              </Fragment>
            ) 
            : null 
          }
          { row._source.edition 
            ? (
              <Fragment>
                <h4>Edition</h4>
                <p>{ row._source.edition }</p>
              </Fragment>
            ) 
            : null 
          }
        </dl>
      </div>
    );
  }

  mapTypeCell( row ) {
    const { locale } = this.props;
    let types = [];

    // Split SLSA into list items - business gets unique SLSA
    if ( /business/ig.test( row._source.businessAppType ) ) {
      types.push( "Business Application" );
    }
    else {
      if ( row._source[ `slsa_primary_${ locale }` ] ) {
        types.push(
          ...row._source[ `slsa_primary_${ locale }` ]
            .replace(/([A-Z])/g, ' $1').trim()
            .split(/%%%%|,\s?|;\s?/g),
        );
      }
      if ( row._source[ `slsa_others_${ locale }` ] ) {
        types.push(
          ...row._source[ `slsa_others_${ locale }` ]
            .replace(/([A-Z])/g, ' $1').trim()
            .split(/%%%%|,\s?|;\s?/g),
        );
      }
    }

    return(
      <div>
        <ul className='list-group'>
          { types.map( ( type, idx ) => (
            <li key={ idx }>{ type }</li>
          ) ) }
        </ul>
      </div>
    );
  }

  mapDetailsCell( row ) {
    const { locale } = this.props;

    return(
      <div>
        { row._source.vendor 
          ? (
            <Fragment>
              <h4>Vendor</h4>
              <p>{ row._source.vendor }</p>
            </Fragment>
          ) 
          : null 
        }
        { row._source.language 
          ? (
            <Fragment>
              <h4>Language</h4>
              <p>{ row._source.language }</p>
            </Fragment>
          ) 
          : null 
        }
        { row._source.compatibility 
          ? (
            <Fragment>
              <h4>Compatibility</h4>
              <p>{ row._source.compatibility }</p>
            </Fragment>
          ) 
          : null 
        }
        {/* <dl className="dl-horizontal brdr-0">
          { row._source.vendor ? (<Fragment><dt>Vendor</dt><dd>{ row._source.vendor }</dd></Fragment>) : null }
          { row._source.language ? (<Fragment><dt>Language</dt><dd>{ row._source.language }</dd></Fragment>) : null }
          { row._source.compatibility ? (<Fragment><dt>Compatibility</dt><dd>{ row._source.compatibility }</dd></Fragment>) : null }
        </dl> */}
        { row._source[ `context_${ locale }` ] ? ( <p>{ row._source[ `context_${ locale }` ].replace(/\r?\n|\r/gm, "") }</p> ) : null }
      </div>
    );
  }

  mapCostCell( row ) {
    const isCost = /cost/i.test( row._source.cost );
    const isCostRecovery = /recover/i.test( row._source.cost );

    // TODO: i18n
    let costText = `${ isCost ? "Cost" : "Free" }${ isCost && isCostRecovery ? " Recovery" : "" }${ row._source.restricted ? " Restricted" : "" }`

    return(
      <div>
        { costText }
      </div>
    );
  }

  mapActionCell( row ) {
    const { locale } = this.props;
    const isCost = /cost/i.test( row._source.cost );
    const isCostRecovery = /recover/i.test( row._source.cost );
    const isException = this.multiExceptionTest.test( row._source[ `context_${ locale }` ] ) || !!row._source.exceptionContact;


    class RequestBtn extends Component {
      handleRequestSoftware( e ) {
        console.log( e );

        if ( isException ) {
          alert( "sw is exception, TODO: determine and handle it" );
        }
        else if ( !isCost || isCostRecovery || ( !isCost && row._source.restricted ) ) {
          alert( "sw is Free, CostRecovery or FreeRestricted, requires redirect to nsd. TODO: " );
        }
        else {
          alert("sw requires redirect to sap");
        }

      }
      
      render() {
        return(
          <button onClick={ this.handleRequestSoftware } className={ "btn btn-default" }>Request</button>
        );
      }
    }

    return <RequestBtn />;
  }

  // Regex used to test for exception formatting in search item context
  multiExceptionTest = /\([0-9]\)(?:.|\r?\n?)*\([0-9]\)/
  
  render() {
    const { query, locale } = this.props;

    const searchQuery = gql`{
      softwareSearch( query: "${ query }", locale: "${ locale }", all: ${ query ? "false" : "true" } ) {
        _id
        _score
        _source {
          name
          acronym
          application
          businessAppType
          compatibility
          edition
          exceptionContact
          shortName
          vendor
          version
          slsa_others_${ locale }
          slsa_primary_${ locale }
          context_${ locale }
          cost
          language
          restricted
          standard
        }
      }
    }`;

    return(
      <Query query={ searchQuery } >
        { ({ loading, error, data }) => {
          if ( loading ) {
            return(
              <div className="container">
                <div className="row">
                  <div className="col-sm-1 col-sm-offset-6">
                    <PropagateLoader 
                      style={{ margin: "0 auto" }}
                      color={ "#cd601e" }
                      loading={ true }
                    />
                  </div>
                </div>
              </div>
            );
          }
          else if ( error ) {
            return(
              <div className="container">
                <div className="row">
                  <div className="col-sm-8 col-sm-offset-2">
                    <div className="alert alert-danger">
                      <h2>Error</h2>
                      <div className="mrgn-tp-lg"><p>Sorry, there was a problem with the search.</p></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return(
            <section id="searchResultsWrapper">
              {/* <h2>Search results</h2> */}
              
              {<MUIDataTable 
                title={ "Search Results" }
                data={ data.softwareSearch }
                options={{
                  caseSensitive: false,
                  // customFilterDialogFooter: null, TODO:
                  // customSearch: null, TODO:
                  // customSort: null, TODO:
                  elevation: 0,
                  enableNestedDataAccess: ".",
                  // onChangePage: null, TODO: scroll-top
                  searchOpen: true,
                  selectableRows: false,
                  viewColumns: false,
                }}
                columns={[
                  {
                    name: '_source.shortName',
                    label: 'Software',
                    options: {
                      filter: true,
                      soft: true,
                      
                    }
                  },
                  {
                    name: `_source.slsa_primary_${ locale }`,
                    label: 'Type',
                    options: {
                      filter: true,
                      soft: true,
                      filterType: 'checkbox',
                    }
                  },
                  {
                    name: '_source.vendor',
                    label: 'Details',
                    options: {
                      filter: true,
                      soft: true,
                    }
                  },
                  {
                    name: '_source.cost',
                    label: 'Cost',
                    options: {
                      filter: true,
                      soft: true,
                    }
                  },
                  {
                    name: '_source.cost',
                    label: 'Action',
                    options: {
                      filter: false,
                      soft: false,
                    }
                  },
                ]}
              />}

            </section>
          );
        } }
      </Query>
    );
  }
}

export default SoftwareSearchResults;

// TODO: Exception template
// <section id="sw-request-modal" className="mfp-hide modal-dialog modal-content overlay-def">
//   <header className="modal-header">
//     <h2 className="modal-title">Request details</h2>
//   </header>
//   <div className="modal-body"> </div>
//   <button type="button" className="mfp-close overlay-close"> x <span className="wb-inv">(escape key)</span> </button>
// </section>