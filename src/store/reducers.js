import { combineReducers } from 'redux';
import locationReducer from './location';
import counterReducer from '../modules/counter';

export default combineReducers({
  location: locationReducer,
  counter: counterReducer
});
