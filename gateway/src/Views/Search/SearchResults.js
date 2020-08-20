import React, { /* Fragment, */ Component } from 'react';
import { Link } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import MUIDataTable from "mui-datatables";
import PropagateLoader from 'react-spinners/PropagateLoader';

const parentPathMap = {
  software: 'software',
  hardware: 'hardware',
  accounts: 'accounts',
  phoneinternet: 'phone-internet',
  conftv: 'conf-tv',
  security: 'security',
  userguide: 'user-guide',
};

class SearchResults extends Component {
  constructor( props ) {
    super( props );

    this.mapResultRow = this.mapResultRow.bind( this );
  }

  mapResultRow( data, idx, i ) {
    const { locale } = this.props;
    const { name, parent_page } = data[ 0 ];
    const linkPath =  `/${ parent_page ? parentPathMap[ parent_page ] + "/" : "" }${ name }/`;

    // console.log( data, idx, i );

    return(
      <div className="list-unstyled text-center wb-eqht gw-cards" key={ i }>
        <li className={ "col-sm-12" }>
          <Link to={ linkPath } role="button" className={ "btn btn-default btn-block well hght-inhrt" } >
            <h3 style={{ width: "fit-content" }}>{ data[ 0 ][ `header_${ locale }` ] }</h3>
            <p style={{ width: "fit-content" }}>{ data[ 0 ][ `description_${ locale }` ] }</p>
          </Link>
        </li>

      </div>
    );
  }

  
  render() {
    const { query, locale } = this.props;

    const searchQuery = gql`{
      gatewaySearch( query: "${ query }", locale: "${ locale }", ) {
        _id
        _score
        _source {
          name
          parent_page
          header_${ locale }
          description_${ locale }
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
              
              <MUIDataTable
                // title={ "Search Results" }
                data={ data.gatewaySearch }
                options={{
                  caseSensitive: false,
                  elevation: 0,
                  download: false,
                  // onChangePage: null, TODO: scroll-top
                  // searchOpen: true,
                  searchPlaceholder: "Filter",
                  customRowRender: this.mapResultRow,
                  selectableRows: false,
                  filter: false,
                  // responsive: 'vertical',
                  customSort: (data, colIndex, order) => {
                    return data.sort((a, b) => {
                      console.log( a, b );
                      return (a.data[colIndex].name < b.data[colIndex].name ? -1: 1 ) * (order === 'desc' ? 1 : -1);
                    });
                  }
                }}
                columns={[
                  {
                    name: `_source`,
                    label: 'Page',
                    options: {
                      filter: true,
                      soft: true,
                      
                    }
                  },
                ]}
              />

            </section>
          );
        } }
      </Query>
    );
  }
}

export default SearchResults;
