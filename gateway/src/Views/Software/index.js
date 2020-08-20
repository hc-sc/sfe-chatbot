import React from 'react';
import { useRouteMatch, Route, Switch  } from 'react-router-dom';

import ReportAProblem from '../../Components/ReportAProblem';

import SoftwareHome from './SoftwareHome';
import SoftwareSearch from './SoftwareSearch';
import SubPage from '../SubPage';

const Software = props => {
  const { path } = useRouteMatch();
  // const { locale } = props.match.params;

  return(
    <main role="main" property="mainContentOfPage" className="container gw-container"> 
      <Switch>
        <Route exact path={ `${ path }/` } render={ props => ( <SoftwareHome { ...props } /> ) } />
        <Route path={ `${ path }/get-software/:query?` } render={ props => ( <SoftwareSearch { ...props } /> ) } />
        <Route path={ `${ path }/:subPage/:query?` } render={ props => <SubPage { ...props } /> } />
      </Switch>
  
      <ReportAProblem { ...props } />
    </main>
  );
}

export default Software;
