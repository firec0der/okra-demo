import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

import { fetchKantarBrands } from '../modules/kantarBrands';
import { fetchMetrics } from '../modules/metrics';
import { fetchKantarAreas } from '../modules/kantarAreas';

export const onHomeEnter = ({ dispatch }) => () => {
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarAreas());
  dispatch(fetchMetrics());
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: onHomeEnter(store) },
  // childRoutes: []
});
