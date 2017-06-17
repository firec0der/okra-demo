import { apiBase } from '../../constants/api';

const LOADING = 'NIELSEN/GENRES_LOADING';
const SUCCESS = 'NIELSEN/GENRES_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  table: {},
  applicableForBrands: [],
};

const loading = () => ({
  type: LOADING
});

const success = ({ table, applicableForBrands }) => ({
  type: SUCCESS,
  payload: { table, applicableForBrands }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        table: action.payload.table,
        applicableForBrands: action.payload.applicableForBrands,
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

export const fetchNielsenGenres = () => dispatch => {
  dispatch(loading());

  return fetch(`${apiBase}/nielsen/genres`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
