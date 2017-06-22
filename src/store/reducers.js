import { combineReducers } from 'redux';

import locationReducer from './location';
import metrics from '../modules/metrics';

import kantarAreas from '../modules/kantar/kantarAreas';
import kantarBrands from '../modules/kantar/kantarBrands';
import kantarGenres from '../modules/kantar/kantarGenres';
import kantarPackagings from '../modules/kantar/kantarPackagings';
import kantarSubcategories from '../modules/kantar/kantarSubcategories';

import nielsenAppliers from '../modules/nielsen/nielsenAppliers';
import nielsenAreas from '../modules/nielsen/nielsenAreas';
import nielsenBrands from '../modules/nielsen/nielsenBrands';
import nielsenChannels from '../modules/nielsen/nielsenChannels';
import nielsenGenres from '../modules/nielsen/nielsenGenres';
import nielsenManufacturers from '../modules/nielsen/nielsenManufacturers';
import nielsenPackagings from '../modules/nielsen/nielsenPackagings';
import nielsenSubcategories from '../modules/nielsen/nielsenSubcategories';

import nwbBrands from '../modules/nwb/nwbBrands';
import nwbGenres from '../modules/nwb/nwbGenres';
import nwbManufacturers from '../modules/nwb/nwbManufacturers';
import nwbSubcategories from '../modules/nwb/nwbSubcategories';

export default combineReducers({
  location: locationReducer,
  metrics,

  kantarAreas,
  kantarBrands,
  kantarGenres,
  kantarPackagings,
  kantarSubcategories,

  nielsenAppliers,
  nielsenAreas,
  nielsenBrands,
  nielsenChannels,
  nielsenGenres,
  nielsenManufacturers,
  nielsenPackagings,
  nielsenSubcategories,

  nwbBrands,
  nwbGenres,
  nwbManufacturers,
  nwbSubcategories
});
