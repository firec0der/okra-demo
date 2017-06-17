import { combineReducers } from 'redux';

import locationReducer from './location';
import metrics from '../modules/metrics';
import kantarBrands from '../modules/kantar/kantarBrands';
import kantarData from '../modules/kantar/kantarData';
import kantarAreas from '../modules/kantar/kantarAreas';
import kantarPackagings from '../modules/kantar/kantarPackagings';
import kantarGenres from '../modules/kantar/kantarGenres';

export default combineReducers({
  location: locationReducer,
  metrics,
  kantarBrands,
  kantarData,
  kantarAreas,
  kantarPackagings,
  kantarGenres
});
