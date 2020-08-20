import React, { Component } from 'react';
import Markdown from '../Markdown';
import PropTypes from 'prop-types';

class Panels extends Component {
  constructor( props ) {
    super( props );

    this.mapSectionPanels = this.mapSectionPanels.bind( this );
    this.openAllPanels = this.openAllPanels.bind( this );
    this.closeAllPanels = this.closeAllPanels.bind( this );

    this.state = {
      openPanels: this.props.panels.map( () => false ),
    };
  }

  openAllPanels( ) {
    this.setState({ openPanels: this.props.panels.map( () => true ) });
  }

  closeAllPanels( ) {
    this.setState({ openPanels: this.props.panels.map( () => false ) });
  }

  mapSectionPanels( tab, idx ) {
    const { locale } = this.props;

    return(
      <details key={ idx } open={ this.state.openPanels[ idx ] } onClick={ () => {  
        this.setState({ openPanels: this.state.openPanels.splice( idx, 1, !this.state.openPanels[ idx ] ) })
      } }>
        <summary>
          <h2 className="h4">{ tab[`header_${ locale }` ] }</h2>
        </summary>
        <Markdown
          source={ tab[ `content_${ locale }` ] }
          pReplacement={ ({ children }) => ( <p>{ children }</p> ) }
        />
      </details>
    );
  }
  
  render() {
    const { panels } = this.props;

    return (
      <div id="toggle-items-im">
        <div className="btn-group" style={{ display: this.props.massToggle ? "inline-block" : "none" }}>
          <button type="button" onClick={ this.openAllPanels } className="btn btn-primary wb-toggle wb-init wb-toggle-inited" >Open All</button>
          <button type="button" onClick={ this.closeAllPanels } className="btn btn-primary wb-toggle wb-init wb-toggle-inited" >Close All</button>
        </div>
        { panels.map( this.mapSectionPanels ) }
      </div>
    );
  }
}

Panels.propTypes = {
  panels: PropTypes.array,
  massToggle: PropTypes.bool,
};

Panels.defaultProps = {
  panels: [ ],
  massToggle: true,
};

export default Panels;