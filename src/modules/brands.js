import { API_BASE_URL } from '../constants/api';

const LOADING = 'BRANDS_LOADING';
const SUCCESS = 'BRANDS_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  list: []
};

const loading = () => ({
  type: LOADING
});

const success = (list) => ({
  type: SUCCESS,
  payload: { list }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        list: action.payload.list,
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

export const fetchBrands = () => dispatch => {
  dispatch(loading());

  return fetch(`${API_BASE_URL}/brands`)
    .then(response => response.json())
    .then(data => dispatch(success(data)));
};