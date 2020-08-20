import React, { Component } from 'react';

class SearchBar extends Component {
  constructor( props ) {
    super( props );

    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.onSearch = this.onSearch.bind( this );

    this.state = {
      searchTerm: "",
    }
  }

  updateSearchTerm( e ) {
    this.setState({ searchTerm: e.target.value });
  }

  onSearch( e ) {
    e.preventDefault();
    const { locale } = this.props.match.params;
    this.props.history.push( `/${ locale }/search/${ encodeURIComponent( this.state.searchTerm ) }` );
    this.props.history.go();
  }

  render() {
    return (
      <section id="wb-srch" className="col-md-5 visible-md visible-lg">
        <h2>Search</h2>
        <form onSubmit={ this.onSearch } id="gw-search-form" role="search" className="form-inline">
          <div className="form-group">
            <label htmlFor="gw-search">Search Service Gateway</label>
            <input onChange={ this.updateSearchTerm } value={ this.state.searchTerm } id="gw-search" className="form-control" name="gw-search" type="search" size="27" maxLength="150" placeholder="Search Service Gateway" />
          </div>
          <button type="submit" id="gw-search-btn" className="btn btn-default btn-sm"> <span className="glyphicon-search glyphicon"></span><span className="wb-inv">Search</span> </button>
        </form>
      </section>
    );
  }
}

export default SearchBar;
