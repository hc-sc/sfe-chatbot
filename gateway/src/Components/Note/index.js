import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Markdown from '../Markdown';

import './Note.scss';

class Note extends Component {
  render() {
    const { header, content, type } = this.props;

    if ( type === "list" ) {
      return (
        <Fragment>
          <h2 className="h4">{ header }</h2>
          <div className={ `list-group` }>
            <Markdown source={ content } components={{
              a: ({ children, href }) => (
                <a href={ href }>{ children }</a>
              ),
              br: () => null,
              li: ({ children }) => (
                <li className={ "list-group-item" }>{ children }</li>
              ),
              ul: ({ children }) => (
                <ul style={{ padding: '0px' }}>{ children }</ul>
              ),
            }} />
          </div>
        </Fragment>
      );
    }

    return(
      <div className={ `gw-note alert alert-${ type }` }>
        <h2 className="h4">{ header }</h2>
        <Markdown source={ content } />
      </div>
    );
  }
}

Note.propTypes = {
  content: PropTypes.string,
  header: PropTypes.string,
  type: PropTypes.oneOf([
    'info',
    'success',
    'alert',
    'warning',
  ]),
};

Note.defaultProps = {
  content: "",
  header: "",
  type: "info",
};


export default Note;

