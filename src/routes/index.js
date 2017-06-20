import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';
import NielsenBarChartPage from '../pages/NielsenBarChartPage/NielsenBarChartPage';

import Q1Page from '../pages/Q1Page/Q1Page';

import { fetchMetrics } from '../modules/metrics';
import { fetchKantarBrands } from '../modules/kantar/kantarBrands';
import { fetchKantarAreas } from '../modules/kantar/kantarAreas';
import { fetchKantarPackagings } from '../modules/kantar/kantarPackagings';
import { fetchKantarGenres } from '../modules/kantar/kantarGenres';

import { fetchNielsenAppliers } from '../modules/nielsen/nielsenAppliers';
import { fetchNielsenAreas } from '../modules/nielsen/nielsenAreas';
import { fetchNielsenBrands } from '../modules/nielsen/nielsenBrands';
import { fetchNielsenGenres } from '../modules/nielsen/nielsenGenres';
import { fetchNielsenChannels } from '../modules/nielsen/nielsenChannels';
import { fetchNielsenLevels } from '../modules/nielsen/nielsenLevels';
import { fetchNielsenManufacturers } from '../modules/nielsen/nielsenManufacturers';
import { fetchNielsenPackagings } from '../modules/nielsen/nielsenPackagings';

export const fetchAllStaticData = ({ dispatch }) => () => {
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarAreas());
  dispatch(fetchMetrics());
  dispatch(fetchKantarPackagings());
  dispatch(fetchKantarGenres());

  dispatch(fetchNielsenAppliers());
  dispatch(fetchNielsenAreas());
  dispatch(fetchNielsenBrands());
  dispatch(fetchNielsenChannels());
  dispatch(fetchNielsenGenres());
  dispatch(fetchNielsenLevels());
  dispatch(fetchNielsenManufacturers());
  dispatch(fetchNielsenPackagings());
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: fetchAllStaticData(store) },
  childRoutes: [
    {
      path: '/nielsen-barchart',
      component: NielsenBarChartPage,
      onEnter: fetchAllStaticData(store)
    },
    {
      path: '/q1',
      component: Q1Page,
      onEnter: fetchAllStaticData(store)
    }
  ]
});
