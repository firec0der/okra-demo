import _ from 'lodash/fp';

import { apiBase } from '../constants/api';

const LOADING = 'KANTAR/DATA_LOADING';
const SUCCESS = 'KANTAR/DATA_SUCCESS';
const CLEAR = 'KANTAR/DATA_CLEAR';
// const FAILURE = 'KANTAR/DATA_FAILURE';

const initialState = {
  isLoading: false,
  error: null,
  list: []
};

const loading = () => ({
  type: LOADING
});

const success = (data) => ({
  type: SUCCESS,
  payload: { list: data }
});

export const clearKantarData = () => ({
  type: CLEAR
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        error: null
      };
    case LOADING:
      return {
        ...state,
        isLoading: true
      };
    case CLEAR:
      return initialState;
    default:
      return state;
  }
};

export const fetchKantarData = dataFilters => dispatch => {
  dispatch(loading());

  const brandIds = _.getOr([], 'brandIds', dataFilters);
  const areaIds = _.getOr([], 'areaIds', dataFilters);
  const packagingId = _.getOr(null, 'packagingId', dataFilters);

  const queryString = []
    .concat(
      brandIds.map(id => `brandIds[]=${id}`),
      areaIds.map(id => `areaIds[]=${id}`),
      packagingId ? `packagingId=${packagingId}` : []
    )
    .join('&');

  return fetch(`${apiBase}/kantar/data?${queryString}`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
