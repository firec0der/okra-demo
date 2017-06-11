import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

import { fetchKantarBrands } from '../modules/kantarBrands';
import { fetchKantarFilters } from '../modules/kantarFilters';

export const onHomeEnter = ({ dispatch }) => () => {
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarFilters());
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: onHomeEnter(store) },
  // childRoutes: []
});
