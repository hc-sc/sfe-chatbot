import React, { /* Fragment, */ Component } from 'react';
import { Link } from 'react-router-i18n';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';


class ServiceInterruptionsWidget extends Component {
  render() {
    const { locale } = this.props.match.params;

    // TODO: Still in text file on network -> scrape using a cron in strapi?
    const queryServiceInterruptions = gql`{
      serviceInterruptions {
        name_${ locale }
        details_${ locale }
        start
        end
        planned
      }
    }`;

    return (
      <Query query={ queryServiceInterruptions } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data.serviceInterruptions );

          return !isLoaded
            ? null
            : (
              <section id="interruptions" className={ `alert alert-info` }> {/* TODO: class matches alert status */}
                <h2 id="service-interruption-title" className="panel-title">Service interruptions</h2>
                <div className="mrgn-tp-md">
                {/* // TODO: display interruptions if n > 0 */}
                  <div id="MySSMBanner">No unplanned IT service interruption at this time</div>
                </div>
                <div className="mrgn-tp-sm">
                  <Link className="btn btn-sm btn-default" to="/service-interruptions">IT service interruptions</Link>
                </div>
              </section>
            );
        } }
      </Query>
    );
  }
}

export default ServiceInterruptionsWidget;
