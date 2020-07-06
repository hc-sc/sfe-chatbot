import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom'

import ReportAProblem from '../../Components/ReportAProblem';

import SoftwareHome from './SoftwareHome';
import SoftwareSearch from './SoftwareSearch';

const Software = props => {
  const { path } = useRouteMatch();

  return(
    <main role="main" property="mainContentOfPage" className="container gw-container"> 
      <Switch>
        <Route exact path={ `${ path }/` } render={ props => ( <SoftwareHome { ...props } /> ) } />
        <Route path={ `${ path }/get/:query?` } render={ props => ( <SoftwareSearch { ...props } /> ) } />
      </Switch>
  
      <ReportAProblem { ...props } />
    </main>
  );
}

export default Software;
