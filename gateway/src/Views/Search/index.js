import React, { /* Fragment, */ Component } from 'react';

import SearchResults from './SearchResults'

class Search extends Component {
  constructor( props ) {
    super( props );

    const { locale, query } = this.props.match.params;

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.onSearch = this.onSearch.bind( this );

    this.state = {
      searchTerm: query || "",
      searchResults: query
        ? (
          <SearchResults query={ query } locale={ locale } />
        )
        : null,
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  // Handle software search
  onSearch( e ) {
    e.preventDefault();

    this.setState({
      searchResults: (
        <SearchResults query={ this.state.searchTerm } locale={ this.props.match.params.locale } />
      ),
    })
  }

  render() {
    // const { locale } = this.props.match.params;

    return (
      <main role="main" property="mainContentOfPage" className="container gw-container">
        {/* TODO: i18n */}
        <h1 property="name" id="wb-cont">Search Results</h1>
        <p>If you are not finding what you are looking for, try performing new search using different keywords.</p>
        <form onSubmit={ this.onSearch } id="gwSearchForm" className="form-inline mrgn-bttm-xl">
          <div className="form-group">
            <label htmlFor="txtSearchSoftware">Search keywords</label>
            <input onChange={ this.updateSearchTerm } value={ this.state.searchTerm } type="text" size="40" className="form-control" id="txtSearchSoftware" placeholder="Search Service Gateway" />
          </div>
          <button type="submit" className="btn btn-default"><span className="glyphicon-search glyphicon"></span><span className="wb-inv">Search</span></button>
        </form>
        { this.state.searchResults }
      </main>
    );
  }
}

export default Search;
