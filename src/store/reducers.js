import { combineReducers } from 'redux';

import locationReducer from './location';
import metrics from '../modules/metrics';
import kantarBrands from '../modules/kantar/kantarBrands';
import kantarData from '../modules/kantar/kantarData';
import kantarAreas from '../modules/kantar/kantarAreas';
import kantarPackagings from '../modules/kantar/kantarPackagings';
import kantarGenres from '../modules/kantar/kantarGenres';

import nielsenAreas from '../modules/nielsen/nielsenAreas';
import nielsenBrands from '../modules/nielsen/nielsenBrands';
import nielsenChannels from '../modules/nielsen/nielsenChannels';
import nielsenGenres from '../modules/nielsen/nielsenGenres';
import nielsenPackagings from '../modules/nielsen/nielsenPackagings';

export default combineReducers({
  location: locationReducer,
  metrics,
  kantarBrands,
  kantarData,
  kantarAreas,
  kantarPackagings,
  kantarGenres,
  nielsenAreas,
  nielsenBrands,
  nielsenChannels,
  nielsenGenres,
  nielsenPackagings
});
