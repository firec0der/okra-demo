import { combineReducers } from 'redux';

import locationReducer from './location';
import kantarBrands from '../modules/kantarBrands';
import metrics from '../modules/metrics';
import kantarData from '../modules/kantarData';
import kantarAreas from '../modules/kantarAreas';
import kantarPackagings from '../modules/kantarPackagings';
import kantarGenres from '../modules/kantarGenres';

export default combineReducers({
  location: locationReducer,
  metrics,
  kantarBrands,
  kantarData,
  kantarAreas,
  kantarPackagings,
  kantarGenres
});
