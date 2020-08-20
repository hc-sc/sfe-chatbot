import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';
import SubPage from '../SubPage';

import ReportAProblem from '../../Components/ReportAProblem';

import ITServicesHome from './ITServicesHome';

const ITServices = props => {
  const { path } = useRouteMatch();

  return(
    <main role="main" property="mainContentOfPage" className="container gw-container"> 
      <Switch>
        <Route exact path={ `${ path }/` } render={ props => ( <ITServicesHome { ...props } /> ) } />
        <Route path={ `${ path }/:subPage/:query?` } render={ props => <SubPage { ...props } /> } />
      </Switch>
  
      <ReportAProblem { ...props } />
    </main>
  );
}

export default ITServices;
