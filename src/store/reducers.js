import { combineReducers } from 'redux';

import locationReducer from './location';
import kantarBrands from '../modules/kantarBrands';
import kantarFilters from '../modules/kantarProperties';
import kantarData from '../modules/kantarData';
import kantarAreas from '../modules/kantarAreas';

export default combineReducers({
  location: locationReducer,
  kantarBrands,
  kantarFilters,
  kantarData,
  kantarAreas
});
