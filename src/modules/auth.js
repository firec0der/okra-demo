// imports from vendors
import { browserHistory } from 'react-router';

// imports from utils
import { createReducer } from '../utils/redux';
import * as localStorageDecorator from '../utils/localStorage';
import { postJson } from '../utils/http';

const AUTH_ROOT = 'AUTH';
export const AUTH_REQUEST = `${AUTH_ROOT}/LOADING`;
export const AUTH_SUCCESS = `${AUTH_ROOT}/SUCCESS`;
export const AUTH_FAILURE = `${AUTH_ROOT}/FAILURE`;
export const AUTH_DESTROY = `${AUTH_ROOT}/DESTROY`;

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  token: null,
  error: null,
};

// Authentication action creators
const startAuthRequest = () => ({ type: AUTH_REQUEST });
const receiveAuthResponse = ({ token }) => ({ type: AUTH_SUCCESS, payload: { token } });
const authRequestFailure = (error) => ({ type: AUTH_FAILURE, payload: { error } });

export default createReducer(initialState, {
  [AUTH_REQUEST]: () => ({ isLoading: true, error: null }),
  [AUTH_SUCCESS]: ({ token }) => ({ token, isLoading: false, isAuthenticated: true, error: null }),
  [AUTH_FAILURE]: ({ error }) => ({ isLoading: false, error }),
  [AUTH_DESTROY]: () => initialState,
});

// Action creator for current state resetting, it destroys current session.
export const destroyAuth = () => (dispatch) => {
  dispatch({ type: AUTH_DESTROY });
  localStorageDecorator.removeItem('auth');
  browserHistory.push('/');
};

// Action creator for authentication.
export const authenticate = (data) => (dispatch) => {
  dispatch(startAuthRequest());

  return postJson('/auth/signin', data)
    .then((data) => {
      const auth = { token: data.token };
      localStorageDecorator.stringifyAndSetItem('auth', auth);
      dispatch(receiveAuthResponse(data));
    })
    .then((error) => dispatch(authRequestFailure(error)));
};
