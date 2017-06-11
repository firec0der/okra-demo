import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

import { fetchKantarBrands } from '../modules/kantarBrands';

export const onHomeEnter = ({ dispatch }) => ({ params }) => {
  dispatch(fetchKantarBrands(params.slug));
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: onHomeEnter(store) },
  // childRoutes: []
});
