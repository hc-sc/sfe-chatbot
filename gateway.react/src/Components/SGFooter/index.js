import React, { /* Fragment, */ Component } from 'react';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import { Image } from 'react-bootstrap';

class SGFooter extends Component {
  constructor( props ) {
    super( props );

  }

  render() {
    const footerQuery = gql`{
      home {
        footer_banner {
          url
          alternativeText
        }
      }
    }`
    // TODO: API UI doens't support bilingual alt text

    return (
      <Query query={ footerQuery } pollInterval={ 300000 }>
        { ({ loading, error, data }) => {

          const banner = ( loading || error )
            ? null // TODO:
            : (
              <Image 
                src={ `http://localhost:1337${ data.home.footer_banner.url }`/* TODO: url */ } 
                alt={ data.home.footer_banner.alternativeText } 
                className="img-responsive pull-right" 
              />
            );

          return(
            <footer role="contentinfo" id="wb-info" className="wb-navcurr wb-navcurr-inited">
              <div className="brand mrgn-tp-md mrgn-bttm-md">
                <div className="container mrgn-tp-md">
                  <div className="row">
                    {/* 
                        TODO: React-scroll top of page component
                    <div className="col-xs-4 visible-sm visible-xs tofpg">
                      <a href="#wb-cont">
                        Haut de la page <span className="glyphicon glyphicon-chevron-up"></span>
                      </a>
                    </div> */}
                    <div className="col-xs-8 col-md-5 pull-right">
                      { banner }
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          );
        } }
      </Query>
    );
  }
}

export default SGFooter;
