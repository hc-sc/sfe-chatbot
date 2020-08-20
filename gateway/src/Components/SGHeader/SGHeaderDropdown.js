import React, { createRef, Component } from 'react';
import { Link, } from 'react-router-i18n';

import i18n from '../../i18n';

class SGHeaderDropdown extends Component {
  constructor( props ) {
    super( props );

    this.outerRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.mapDropdownLinks = this.mapDropdownLinks.bind( this );
    this.toggleExpand = this.toggleExpand.bind( this );

    this.state = {
      expanded: false,
    }
  }

  componentDidMount() {
    document.addEventListener( 'mousedown', this.handleClickOutside );
  }

  componentWillUnmount() {
    document.removeEventListener( 'mousedown', this.handleClickOutside );
  }

  // Close dropdown on outerclick
  handleClickOutside( e ) {
    if ( this.outerRef && !this.outerRef.current.contains( e.target ) ) {
      this.toggleExpand( false );
    }
  }

  mapDropdownLinks( page, idx ) {
    return(
      <li key={ idx }>
        <Link to={ `${ this.props.all }/${ page.name }` } tabIndex="-1" aria-posinset="1" aria-setsize="2" role="menuitem">
          { page[ `header_${ this.props.locale }` ] }
        </Link>
      </li>
    );
  }

  toggleExpand( expanded = !this.state.expanded ) {
    this.setState({ expanded });
  }

  render() {
    const { locale, active } = this.props;
    const sortedItems = {};
    const menuItems = [];

    // Group and sort pages by category
    for ( const page of this.props.pages ) {
      // FIXME: un-categorized just stack ontop
      if ( /none/i.test( page.category ) ) {
        menuItems.push( this.mapDropdownLinks( page, page.name ) );
        continue;
      }
      
      if ( !sortedItems[ page.category ] ) {
        sortedItems[ page.category ] = [ ];
      }

      sortedItems[ page.category ].push( Object.assign( {}, {
        name: page.name,
        [ `header_${ locale }` ]: page[ `header_${ locale }` ],
      }) );
    }

    // Create header-nested list
    for ( const category in sortedItems ) {
      if ( sortedItems[ category ].length > 1 ) {
        // Many items - create list under header
        menuItems.push(
          <li key={ category }>
            <a href="#" className="gw-li-multi" tabIndex="-1" aria-posinset="1" aria-setsize="4" role="menuitem" aria-haspopup="true">
              { i18n.getTranslation( this.props.location, `header.categories.${ category }` ) }
            </a>
            <ul>
              { sortedItems[ category ].map( this.mapDropdownLinks ) }
            </ul>
          </li>
        );
      }
      else {
        // Single item - no header
        menuItems.push(
          this.mapDropdownLinks( sortedItems[ category ][ 0 ], sortedItems[ category ][ 0 ].name ),
        );
      }
    }

    return(
      <li onMouseEnter={ () => this.toggleExpand( true ) } onMouseLeave={ () => this.toggleExpand( false ) } ref={ this.outerRef }>
        <a href="#" className={ `item ${ active && "wb-navcurr" } ${ this.state.expanded ? "expanded" : "" }` } tabIndex="-1" aria-posinset="2" aria-setsize="7" role="menuitem" aria-haspopup="true">
         { this.props.header }<span className="expicon glyphicon glyphicon-chevron-down"></span>
        </a>
				<ul className={ `sm list-unstyled ${ this.state.expanded ? "open" : "" }` } role="menu" aria-expanded={ this.state.expanded ? "true" : "false" } aria-hidden={ this.state.expanded ? "false" : "true" }>
          { menuItems }
					<li className="slflnk"> <Link className={ `${ active && "wb-navcurr" }` } to={ this.props.all } role="menuitem" tabIndex="-1" aria-posinset="4" aria-setsize="4">{ this.props.header } – all</Link> </li>
				</ul>
			</li>
    );
  }
}

export default SGHeaderDropdown;