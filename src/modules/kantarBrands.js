import { apiBase } from '../constants/api';

const LOADING = 'KANTAR/BRANDS_LOADING';
const SUCCESS = 'KANTAR/BRANDS_SUCCESS';
// const FAILURE = 'KANTAR/BRANDS_FAILURE';

const initialState = {
  isLoading: false,
  error: null,
  table: {}
};

const loading = () => ({
  type: LOADING
});

const success = (data) => ({
  type: SUCCESS,
  payload: { table: data }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        table: action.payload.table,
        isLoading: false,
        error: null
      };
    case LOADING:
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
};

export const fetchKantarBrands = () => dispatch => {
  dispatch(loading());

  return fetch(`${apiBase}/kantar/brands`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
