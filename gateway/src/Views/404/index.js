import React, { /* Fragment, */ Component } from 'react';

import { NavLink } from 'react-router-i18n';

class NotFound extends Component {
  render() {
    return(
      <main role="main" property="mainContentOfPage" className="container">
        <div className="row mrgn-tp-lg">
          <section className="col-sm-12 col-md-6">
            <h2><span className="glyphicon glyphicon-warning-sign mrgn-rght-md"></span> We couldn't find that Web page</h2>
            <p>Error 404</p>
            <p>We're sorry you ended up here. Sometimes a page gets moved or deleted, but hopefully we can help you find what you're looking for.</p>
            <ul>
              <li>Return to the <NavLink lang="en" ignoreLocale to="/en/home">home page</NavLink></li>
            </ul>
          </section>
          <section lang="fr" className="col-sm-12 col-md-6">
            <h2><span className="glyphicon glyphicon-warning-sign mrgn-rght-md"></span> Nous ne pouvons trouver cette page Web</h2>
            <p>Erreur 404</p>
            <p>Nous sommes désolés que vous ayez abouti ici. Il arrive parfois qu'une page ait été déplacée ou supprimée. Heureusement, nous pouvons vous aider à trouver ce que vous cherchez.</p>
            <ul>
              <li>Retournez à la <NavLink lang="fr" ignoreLocale to="/fr/home">page d'accueil</NavLink></li>
            </ul>
          </section>
        </div>
      </main>
    );
  }
}

export default NotFound;