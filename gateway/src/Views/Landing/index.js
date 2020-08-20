import React, { /* Fragment  */} from 'react';
import { useRouteMatch, Route, Switch  } from 'react-router-dom'
import { Redirect } from 'react-router-i18n';

import Home from './Home';
// import Search from './Search';

const Landing = props => {
  const { path } = useRouteMatch();
  const { locale } = props.match.params;

  return(
    <Switch>
      <Route exact path={ `${ path }/` } render={ props => <Home { ...props } /> } />
      <Route path={ `${ path }/:page/:not?/:found?` } render={ props => <Redirect { ...props } ignoreLocale to={ `/${ locale }/404` } /> } />
    </Switch>
  );
}

export default Landing;
