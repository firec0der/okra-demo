import { combineReducers } from 'redux';

import locationReducer from './location';
import metrics from '../modules/metrics';

import kantarAreas from '../modules/kantar/kantarAreas';
import kantarBrands from '../modules/kantar/kantarBrands';
import kantarGenres from '../modules/kantar/kantarGenres';
import kantarLevels from '../modules/kantar/kantarLevels';
import kantarPackagings from '../modules/kantar/kantarPackagings';
import kantarData from '../modules/kantar/kantarData';

import nielsenAppliers from '../modules/nielsen/nielsenAppliers';
import nielsenAreas from '../modules/nielsen/nielsenAreas';
import nielsenBrands from '../modules/nielsen/nielsenBrands';
import nielsenChannels from '../modules/nielsen/nielsenChannels';
import nielsenGenres from '../modules/nielsen/nielsenGenres';
import nielsenLevels from '../modules/nielsen/nielsenLevels';
import nielsenManufacturers from '../modules/nielsen/nielsenManufacturers';
import nielsenPackagings from '../modules/nielsen/nielsenPackagings';

import nwbBrands from '../modules/nwb/nwbBrands';
import nwbGenres from '../modules/nwb/nwbGenres';
import nwbManufacturers from '../modules/nwb/nwbManufacturers';

export default combineReducers({
  location: locationReducer,
  metrics,
  kantarAreas,
  kantarBrands,
  kantarGenres,
  kantarLevels,
  kantarPackagings,

  kantarData,

  nielsenAppliers,
  nielsenAreas,
  nielsenBrands,
  nielsenChannels,
  nielsenGenres,
  nielsenLevels,
  nielsenManufacturers,
  nielsenPackagings,

  nwbBrands,
  nwbGenres,
  nwbManufacturers
});
