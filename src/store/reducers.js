import { combineReducers } from 'redux';

import locationReducer from './location';
import kantarBrands from '../modules/kantarBrands';
import kantarFilters from '../modules/kantarFilters';

export default combineReducers({
  location: locationReducer,
  kantarBrands,
  kantarFilters
});
