import { apiBase } from '../../constants/api';

const LOADING = 'NIELSEN/AREAS_LOADING';
const SUCCESS = 'NIELSEN/AREAS_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  table: {}
};

const loading = () => ({
  type: LOADING
});

const success = data => ({
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

export const fetchNielsenAreas = () => dispatch => {
  dispatch(loading());

  return fetch(`${apiBase}/nielsen/areas`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
