import React from 'react';

import Route from 'react-router/lib/Route';
import Redirect from 'react-router/lib/Redirect';
import IndexRoute from 'react-router/lib/IndexRoute';
import IndexRedirect from 'react-router/lib/IndexRedirect';

import Footer from 'ui-elements/Footer';
import App from './views/App';
import LibraryDashboard from './views/LibraryDashboard';
import LibraryDetails from './views/LibraryDetails';


const dashboardComponent = {
  children: LibraryDashboard,
  Footer,
};

const libraryDetailsComponent = {
  children: LibraryDetails,
  Footer,
};

export default (
  <Route components={App} path="/">
    <Route components={dashboardComponent} path="asset">
      <Redirect from="library" to="/asset" />
      <Route components={libraryDetailsComponent} path="library/:libraryId" />
    </Route>
    <Route components={libraryDetailsComponent} path="asset/library/:libraryId/edit" isEdit />
    <Route components={dashboardComponent} path="store" isStore>
      <Redirect from="collection" to="/store" />
      <Redirect from="library" to="/store" />
      <Route components={libraryDetailsComponent} path="library/:libraryId" isStore />
    </Route>
    <Route components={dashboardComponent} path="store/collection/:collectionId" isStore>
      <Route path=":alias" isStore />
    </Route>
  </Route>
);
