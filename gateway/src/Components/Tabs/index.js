import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import Markdown from '../Markdown';

import Note from '../Note';

// #TODO: Use id to open active tab if present in path (i.e. /en/install-printers#network-printers open install printer view showing network printer tab)

class Tabs extends Component {
  constructor( props ) {
    super( props );

    this.mapTabHeader = this.mapTabHeader.bind( this );
    this.mapTabPanel = this.mapTabPanel.bind( this );
    this.mapActions = this.mapActions.bind( this );
    this.mapNotes = this.mapNotes.bind( this );
  
    this.state = {
      currentTab: 0 ,
    };
  }

  setCurrentTab( idx ) {
    this.setState({ currentTab: idx });
  }

  mapNotes ( note, idx ) {
    const { locale, } = this.props;
    
    return (
      <Note
        key={ idx }
        type={ note.type }
        header={ note[ `header_${ locale }` ] }
        content={ note[ `content_${ locale }` ] }
      />
    );
  }

  // Maps tab actions into buttons
  mapActions( action, idx ) {
    const { locale, } = this.props;

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

  mapTabPanel( tab, idx ) {
    const { locale } = this.props;

    const notes = tab.notes.map( this.mapNotes );
    const actions = tab.actions.map( this.mapActions );

    const isVisible = idx === this.state.currentTab;
    
    return(
      <details
        key={ idx } id={ tab.name } role="tabpanel"
        className={ `wb-auto-${ idx }-grp fade ${ isVisible ? "in" : "out noheight" }` }
        open={ isVisible }
        aria-expanded={ isVisible ? "true" : "false" }
        aria-hidden={ isVisible ? "false" : "true" }
        aria-labelledby={ `${ tab.name }-lnk` }
      >
        <summary role="tab" id={ `wb-auto-${ idx }` } tabIndex="0"
          className="wb-toggle tgl-tab wb-init wb-toggle-inited"
          aria-hidden={ isVisible ? "false" : "true" }
          aria-selected="true"
          aria-posinset={ `${ idx }` }
          aria-setsize="3"
        >
          { tab[ `header_${ locale }` ] }
        </summary>
        <div 
          className="tgl-panel" 
          aria-labelledby={ `wb-auto-${ idx }` }
          aria-expanded="true"
          aria-hidden="false"
        >
          <div className="row mrgn-rght-0 mrgn-lft-0 mrgn-tp-md">
            <div className="col-md-8">
              <Markdown source={ tab[ `content_${ locale }` ] } />
            </div>
            <div className="col-md-4">
              { notes }
            </div>
            <div className="col-md-12">
              { actions }
            </div>
          </div>
        </div>
      </details>
    );
  }

  mapTabHeader( header, idx ) {
    const { locale } = this.props;

    const isVisible = idx === this.state.currentTab;

    return(
      <li key={ idx } className={ `${ isVisible && "active" }` } role="presentation">
        <a onClick={ e => { e.preventDefault(); this.setCurrentTab( idx ); } } id={ `${ header.name }-lnk` } href={ `#${ header.name }` } tabIndex="0" role="tab" aria-selected="true" aria-controls={ header.name }>
          { header[ `header_${ locale }` ] }
        </a>
      </li>
    );
  }

  render() {
    const { tabs, locale } = this.props;

    const tabHeaders = tabs.map( this.mapTabHeader );
    const tabPanels = tabs.map( this.mapTabPanel );

    return(
      <div className="wb-tabs mrgn-tp-lg wb-prettify wb-init wb-prettify-inited wb-tabs-inited tabs-acc" id="wb-auto-1">
        <ul role="tablist" aria-live="off" className="generated" aria-hidden="false">
          { tabHeaders }
        </ul>
        <div className="tabpanels" data-wb-tabs="{&quot;ignoreSession&quot;: true}">
          { tabPanels }
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  locale: PropTypes.string,
  tabs: PropTypes.array, //TODO: Array of?
};

export default Tabs;

