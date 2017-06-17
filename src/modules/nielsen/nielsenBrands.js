import { apiBase } from '../../constants/api';

const LOADING = 'NIELSEN/BRANDS_LOADING';
const SUCCESS = 'NIELSEN/BRANDS_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  dictionary: {}
};

const loading = () => ({
  type: LOADING
});

const success = ({ dictionary }) => ({
  type: SUCCESS,
  payload: { dictionary }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        dictionary: action.payload.dictionary,
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

export const fetchNielsenBrands = () => dispatch => {
  dispatch(loading());

  return fetch(`${apiBase}/nielsen/brands`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
