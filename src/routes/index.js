import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/Home/Home';

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage },
  // childRoutes: []
});
