import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

import { fetchMetrics } from '../modules/metrics';
import { fetchKantarBrands } from '../modules/kantar/kantarBrands';
import { fetchKantarAreas } from '../modules/kantar/kantarAreas';
import { fetchKantarPackagings } from '../modules/kantar/kantarPackagings';
import { fetchKantarGenres } from '../modules/kantar/kantarGenres';

import { fetchNielsenAreas } from '../modules/nielsen/nielsenAreas';
import { fetchNielsenBrands } from '../modules/nielsen/nielsenBrands';

export const onHomeEnter = ({ dispatch }) => () => {
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarAreas());
  dispatch(fetchMetrics());
  dispatch(fetchKantarPackagings());
  dispatch(fetchKantarGenres());

  dispatch(fetchNielsenAreas());
  dispatch(fetchNielsenBrands());
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: onHomeEnter(store) },
  // childRoutes: []
});
