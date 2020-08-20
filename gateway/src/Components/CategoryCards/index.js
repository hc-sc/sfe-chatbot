import React, { Component } from 'react';
import { Link } from 'react-router-i18n';
import Markdown from '../Markdown';
import PropTypes from 'prop-types';

const parentPathMap = {
  software: 'software',
  hardware: 'hardware',
  accounts: 'accounts',
  phoneinternet: 'phone-internet',
  conftv: 'conf-tv',
  security: 'security',
  userguide: 'user-guide',
};

class CategoryCards extends Component {
  constructor( props ) {
    super( props );

    this.mapCards = this.mapCards.bind( this );
    this.mapSubpages = this.mapSubpages.bind( this );
  }

  mapSubpages( subPage, idx ) {
    const { locale } = this.props;

    const { name, parent_page } = subPage;
    const linkPath =  `/${ parent_page ? parentPathMap[ parent_page ] + "/" : "" }${ name }/`;

    return (
      <li className="list-group-item">
        <Link to={ linkPath } >
          <span className="glyphicon glyphicon-chevron-right"></span> { subPage[ `header_${ locale }` ] }
        </Link>
      </li>
    );
  }

  mapCards( card, idx ) {
    const { locale, className } = this.props;

    const subPages = card?.sub_pages.map( this.mapSubpages );

    return(
      <div className={ className } key={ idx }>
        <section className="panel panel-default hght-inhrt">
          <div className="panel-heading">
            <h2 className="panel-title">{ card[`header_${ locale }` ] }</h2>
          </div>
          <div className="panel-body">
            <Markdown
              source={ card[ `content_${ locale }` ] }
              pReplacement={ ({ children }) => ( <p>{ children }</p> ) }
            />
            <ul className="list-group gw-list-group mrgn-bttm-0 list-unstyled">
              { subPages }
            </ul>
          </div>
        </section>
      </div>
    );
  }
  
  render() {
    const { cards } = this.props;

    // TODO: Needs flex-box for same height, low prio
    return (
      <div className="row wb-eqht wb-init wb-eqht-inited">
        { cards.map( this.mapCards ) }
      </div>
    );
  }
}

CategoryCards.propTypes = {
  cards: PropTypes.array,
  className: PropTypes.string,
};

CategoryCards.defaultProps = {
  cards: [ ],
  className: "col-sm-12 col-md-4",
};

export default CategoryCards;