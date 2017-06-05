import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/Home/Home';
import CounterPage from '../pages/Counter/Counter';

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage },
  childRoutes : [
    {
      path : 'counter',
      component: CounterPage
    }
  ]
});
