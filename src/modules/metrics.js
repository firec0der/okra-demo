import { API_BASE_URL } from '../constants/api';

const LOADING = 'METRICS_LOADING';
const SUCCESS = 'METRICS_SUCCESS';

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

export const fetchMetrics = () => dispatch => {
  dispatch(loading());

  return fetch(`${API_BASE_URL}/metrics`)
    .then(response => response.json())
    .then(data => dispatch(success(data)));
};
