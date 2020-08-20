import React, { /* Fragment, */ Component } from 'react';
import { Link } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import { Image } from 'react-bootstrap';

class SGFooter extends Component {
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

          const isLoaded = ( !loading && !error && data.home );

          const banner = !isLoaded
            ? null // TODO:
            : (
              <Image 
                src={ `http://localhost:1337${ data.home.footer_banner.url }`/* TODO: url */ } 
                alt={ data.home.footer_banner.alternativeText } 
                className="img-responsive pull-right" 
              />
            );

          return(
            <footer role="contentinfo" id="wb-info" className="visible-sm visible-md visible-lg wb-navcurr wb-navcurr-inited">
              <div className="brand mrgn-tp-md mrgn-bttm-md">
              
              {/* TODO: Home only! */}
              <div className="container-fluid">
                <nav role="navigation" className="row col-sm-10 col-sm-offset-1">
                  <h2>Initiatives, guides and contacts</h2>
                  <section className="col-sm-3">
                    <h3 className="h4">IM/IT initiatives</h3>
                    <ul className="list-unstyled">
                      <li><a href="https://www.gcpedia.gc.ca/wiki/Initiative_Windows10?setlang=en&amp;uselang=en" target="_blank" rel="noopener noreferrer"><span className="glyphicon glyphicon-chevron-right"></span> Windows 10</a></li>
                      <li><a href="https://www.gcpedia.gc.ca/wiki/Initiative_Office2016?setlang=en&amp;uselang=en" target="_blank" rel="noopener noreferrer"><span className="glyphicon glyphicon-chevron-right"></span> Office 2016</a></li>
                      {/* Hiding temp <li><a href="http://www.gcpedia.gc.ca/wiki/IMIT_Initiatives_PDF_Application_Migration" target="_blank"><span className="glyphicon glyphicon-chevron-right"></span> PDF application migration</a></li> */}
                      <li><a href="http://www.gcpedia.gc.ca/wiki/GCdocs_at_Health_Canada" target="_blank" rel="noopener noreferrer"><span className="glyphicon glyphicon-chevron-right"></span> GCdocs</a></li>
                      <li><a href="https://www.gcpedia.gc.ca/wiki/Initiative_GCWifi?setlang=en&amp;uselang=en" target="_blank" rel="noopener noreferrer"><span className="glyphicon glyphicon-chevron-right"></span> GC Wi-Fi</a></li>
                      <li><a href="https://www.gcpedia.gc.ca/wiki/Initiative_PDFMigration?setlang=en&amp;uselang=en" target="_blank" rel="noopener noreferrer"><span className="glyphicon glyphicon-chevron-right"></span> PDF Migration</a></li>
                    </ul>
                  </section>
                  <section className="col-sm-5">
                    <h3 className="h4">User guides &amp; learning resources</h3>
                    <ul className="list-unstyled">
                      {/* TODO: i18 Links */}
                      {/* <Link to={ '/im' } ></Link> */}
                      <li><a href="ug-im.html"><span className="glyphicon glyphicon-chevron-right"></span> Information management</a></li>
                      <li><a href="ug-it-sec.html"><span className="glyphicon glyphicon-chevron-right"></span> IT security</a></li>
                      <li><a href="ug-outlook.html"><span className="glyphicon glyphicon-chevron-right"></span> Outlook – email</a></li>
                      <li><a href="ug-lotus.html"><span className="glyphicon glyphicon-chevron-right"></span> Lotus Notes</a></li>
                      <li><a href="ug-remote.html"><span className="glyphicon glyphicon-chevron-right"></span> Remote access (WebOffice)</a></li>
                    </ul>
                  </section>
                  <section className="col-sm-4">
                    <h3 className="h4">Contact us</h3>
                    <ul className="list-unstyled">
                      <li><span className="glyphicon glyphicon-envelope"></span> Email: <a href="mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca">Business Improvement Office (BIO)</a></li>
                    </ul>
                  </section>
                </nav>
              </div>

                <div className="brand mrgn-tp-md mrgn-bttm-md container-fluid brdr-tp">
                  <div className="mrgn-tp-md col-sm-10 col-sm-offset-1">
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
              </div>
            </footer>
          );
        } }
      </Query>
    );
  }
}

export default SGFooter;
