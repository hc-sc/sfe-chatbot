import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';
import SubPage from '../SubPage';

import ReportAProblem from '../../Components/ReportAProblem';

import AdaptiveTechHome from './AdaptiveTechHome';

const AdaptiveTech = props => {
  const { path } = useRouteMatch();
  // const { locale } = props.match.params;

  return(
    <main role="main" property="mainContentOfPage" className="container gw-container"> 
      <Switch>
        <Route exact path={ `${ path }/` } render={ props => ( <AdaptiveTechHome { ...props } /> ) } />
        <Route path={ `${ path }/:subPage/:query?` } render={ props => <SubPage { ...props } /> } />
      </Switch>
  
      <ReportAProblem { ...props } />
    </main>
  );
}

export default AdaptiveTech;
