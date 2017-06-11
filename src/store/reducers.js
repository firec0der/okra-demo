import { combineReducers } from 'redux';

import locationReducer from './location';
import kantarBrands from '../modules/kantarBrands';
import kantarFilters from '../modules/kantarFilters';
import kantarData from '../modules/kantarData';

export default combineReducers({
  location: locationReducer,
  kantarBrands,
  kantarFilters,
  kantarData
});
