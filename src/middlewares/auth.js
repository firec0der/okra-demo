// imports from vendors
import _ from 'lodash/fp';
import { browserHistory } from 'react-router';

// imports from utils
import * as localStorage from '../utils/localStorage';

export const forbidden = () => (next) => (action) => {
  // Skip any check on the main page.
  const location = browserHistory.getCurrentLocation();
  if (location.pathname === '/sign-in') {
    return next(action);
  }

  const { type, payload } = action;

  const actionTypeParts = type.split('/');
  const actionTypeSuffix = _.last(actionTypeParts);

  if (actionTypeSuffix === 'FAILURE') {
    const apiStatus = _.getOr(null, 'error.apiStatus', payload);

    if (apiStatus === 401) {
      localStorage.removeItem('auth');
      browserHistory.push('/sign-in');
      return null;
    }
  }

  return next(action);
};
