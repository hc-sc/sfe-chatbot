import React, { Component } from 'react';
import Panels from '../../Components/Panels';
import Markdown from '../../Components/Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import ReportAProblem from '../../Components/ReportAProblem';


class ITServiceInterruptions extends Component {
  render() {
    const { locale } = this.props.match.params;

    const queryITSIHome = gql`{
      serviceInterruptions {
        name_${ locale }
        details_${ locale }
        start
        end
        planned
      }
      homePages( where: { name: "service-interruptions" } ) {
        header_${ locale }
        content_${ locale }
        tab_groups {
          tabs {
            header_${ locale }
            content_${ locale }
          }
        }
      }
    }`

    return (
      <Query query={ queryITSIHome } pollInterval={ 300000 } >
        { ({ loading, error, data }) => {

          const isLoaded = ( !loading && !error && data?.homePages[ 0 ] );

          data = data?.homePages[ 0 ];

          const title = !isLoaded
            ? null // TODO:
            : data[ `header_${ locale }` ];

          const content = !isLoaded
            ? null // TODO:
            : (
              <Markdown source={ data[ `content_${ locale }` ] } />
            );

          return (
            <main role="main" property="mainContentOfPage" className="container gw-container"> 
              <h1 property="name" id="wb-cont">{ title }</h1>

              {/* TODO: Display unplanned inturruptions */}
              <div id="unplanned-service-interruption-alert" className="alert alert-warning">
                <h2 id="service-interruption-title">Interruption de service imprévue</h2>
                {/* <div id="service-interruption-info" class="mrgn-tp-lg"><div id="wb-auto-1_wrapper" class="dataTables_wrapper no-footer"><div class="top"><div id="wb-auto-1_filter" class="dataTables_filter"><label>Filtrer les articles<input type="search" class="" placeholder="" aria-controls="wb-auto-1"></label></div><div class="dataTables_info" id="wb-auto-1_info" role="status" aria-live="polite">Affiche 1 à 1 de 1 entrées</div><div class="dataTables_length" id="wb-auto-1_length"><label>Afficher <select name="wb-auto-1_length" aria-controls="wb-auto-1" class=""><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entrées</label></div></div><table class="table table-bordered wb-tables wb-init wb-tables-inited dataTable no-footer" id="wb-auto-1" aria-describedby="wb-auto-1_info" role="grid"><thead><tr class="bg-info" role="row"><th class="headerSSM sorting_asc" tabindex="0" aria-controls="wb-auto-1" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Nom&amp;#160;: activer pour tri descendant" style="width: 97px;">Nom<span class="sorting-cnt"><span class="sorting-icons"></span></span></th><th class="headerSSM sorting" tabindex="0" aria-controls="wb-auto-1" rowspan="1" colspan="1" aria-label="détails&amp;#160;: activer pour tri ascendant" style="width: 765px;">détails<span class="sorting-cnt"><span class="sorting-icons"></span></span></th><th class="headerSSM sorting" tabindex="0" aria-controls="wb-auto-1" rowspan="1" colspan="1" aria-label="début&amp;#160;: activer pour tri ascendant" style="width: 98px;">début<span class="sorting-cnt"><span class="sorting-icons"></span></span></th><th class="headerSSM sorting" tabindex="0" aria-controls="wb-auto-1" rowspan="1" colspan="1" aria-label="fin&amp;#160;: activer pour tri ascendant" style="width: 72px;">fin<span class="sorting-cnt"><span class="sorting-icons"></span></span></th></tr></thead><tbody><tr role="row"><td class="col3SSM sorting_1">Wi-Fi du GC</td><td class="col2SSM">Veuillez noter que les utilisateurs rencontrent actuellement des difficultés pour se connecter à Wifi.</td><td class="col3SSM">2019-10-10</td><td class="col1SSM"></td></tr></tbody></table><div class="bottom"><div class="dataTables_paginate paging_simple_numbers" id="wb-auto-1_paginate"><ol class="pagination mrgn-tp-0 mrgn-bttm-0"><li><a class="paginate_button previous disabled" aria-controls="wb-auto-1" data-dt-idx="0" tabindex="0" id="wb-auto-1_previous" role="button" href="javascript:;">Précédent</a></li><li><a class="paginate_button current" aria-controls="wb-auto-1" data-dt-idx="1" tabindex="0" role="button" href="javascript:;" aria-pressed="true"><span class="wb-inv">Page </span><span class="wb-inv">Page </span>1</a></li><li><a class="paginate_button next disabled" aria-controls="wb-auto-1" data-dt-idx="2" tabindex="0" id="wb-auto-1_next" role="button" href="javascript:;">Suivant</a></li></ol></div></div><div class="clear"></div></div></div> */}
              </div>

              {/* TODO: Display planned inturruptions */}
              <div id="planned-service-interruption-alert" className="alert alert-info">
                <h2>Interruption de service informatique planifiée</h2>
                <div id="PlannedITServiceInterruptionsSchedule" className="mrgn-tp-lg"><p>Aucune interruption de service informatique planifiée prévue.</p></div>
              </div>

              { content }

              {/* Incorporated disclaimer as panel for consistency in backend */}
              <Panels massToggle={ false } locale={ locale } panels={ data?.tab_groups[ 0 ].tabs.slice( 0, -1 ) } />
              <Markdown source={ data?.tab_groups[ 0 ].tabs.slice( -1 )[ 0 ][ `content_${ locale }` ] } />

              <ReportAProblem { ...this.props } />
            </main>
          );
        } }
      </Query>
    );
  }
}

export default ITServiceInterruptions;
