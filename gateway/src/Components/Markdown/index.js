import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import unified from 'unified'
import parse from 'remark-parse'
import remarkAbbr from "remark-abbr";
import remarkBreaks from "remark-breaks";
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

class Markdown extends Component {
  render() {
    const { 
      source,
      components,
      pReplacement = ({ children }) => ( <span>{ children }</span> ), // Used tp substitute's p tag - depending arrangement nested paragraphs throw errors..
    } = this.props;

    const content = unified()
      .use( parse )
      .use( remarkAbbr )
      .use( remarkBreaks )
      .use( remark2rehype )
      .use( rehype2react, {
        Fragment,
        createElement: React.createElement,
        components: Object.assign( {
          p: pReplacement,
        }, components ),
      } )
      .processSync( source );

    return(
      <Fragment>
        { content.result }
      </Fragment>
    );
  }
}

Markdown.defaultProps = {
  source: "",
  components: { },
};

Markdown.propTypes = {
  source: PropTypes.string,
  components: PropTypes.object,
};


export default Markdown;

