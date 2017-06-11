import { combineReducers } from 'redux';

import locationReducer from './location';
import kantarBrands from '../modules/kantarBrands';

export default combineReducers({
  location: locationReducer,
  kantarBrands
});
