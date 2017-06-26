import CoreLayout from '../layouts/PageLayout/PageLayout';

import HomePage from '../pages/HomePage/HomePage';

import Q1Page from '../pages/Q1Page/Q1Page';

import { fetchMetrics } from '../modules/metrics';
import { fetchBrands } from '../modules/brands';
import { fetchManufacturers } from '../modules/manufacturers';

import { fetchKantarBrands } from '../modules/kantar/kantarBrands';
import { fetchKantarAreas } from '../modules/kantar/kantarAreas';
import { fetchKantarGenres } from '../modules/kantar/kantarGenres';
import { fetchKantarPackagings } from '../modules/kantar/kantarPackagings';
import { fetchKantarSubcategories } from '../modules/kantar/kantarSubcategories';

import { fetchNielsenAppliers } from '../modules/nielsen/nielsenAppliers';
import { fetchNielsenAreas } from '../modules/nielsen/nielsenAreas';
import { fetchNielsenBrands } from '../modules/nielsen/nielsenBrands';
import { fetchNielsenGenres } from '../modules/nielsen/nielsenGenres';
import { fetchNielsenChannels } from '../modules/nielsen/nielsenChannels';
import { fetchNielsenManufacturers } from '../modules/nielsen/nielsenManufacturers';
import { fetchNielsenPackagings } from '../modules/nielsen/nielsenPackagings';
import { fetchNielsenSubcategories } from '../modules/nielsen/nielsenSubcategories';

import { fetchNwbBrands } from '../modules/nwb/nwbBrands';
import { fetchNwbGenres } from '../modules/nwb/nwbGenres';
import { fetchNwbManufacturers } from '../modules/nwb/nwbManufacturers';
import { fetchNwbSubcategories } from '../modules/nwb/nwbSubcategories';

export const fetchAllStaticData = ({ dispatch }) => () => {
  dispatch(fetchMetrics());
  dispatch(fetchBrands());
  dispatch(fetchManufacturers());

  dispatch(fetchKantarAreas());
  dispatch(fetchKantarBrands());
  dispatch(fetchKantarGenres());
  dispatch(fetchKantarPackagings());
  dispatch(fetchKantarSubcategories());

  dispatch(fetchNielsenAppliers());
  dispatch(fetchNielsenAreas());
  dispatch(fetchNielsenBrands());
  dispatch(fetchNielsenChannels());
  dispatch(fetchNielsenGenres());
  dispatch(fetchNielsenManufacturers());
  dispatch(fetchNielsenPackagings());
  dispatch(fetchNielsenSubcategories());

  dispatch(fetchNwbBrands());
  dispatch(fetchNwbGenres());
  dispatch(fetchNwbManufacturers());
  dispatch(fetchNwbSubcategories());
};

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: HomePage, onEnter: fetchAllStaticData(store) },
  childRoutes: [
    {
      path: '/q1',
      component: Q1Page,
      onEnter: fetchAllStaticData(store)
    }
  ]
});
