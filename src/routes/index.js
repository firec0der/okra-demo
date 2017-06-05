import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage },
  // childRoutes: []
});
