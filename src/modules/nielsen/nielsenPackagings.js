import { API_BASE_URL } from '../../constants/api';

const LOADING = 'NIELSEN/PACKAGINS_LOADING';
const SUCCESS = 'NIELSEN/PACKAGINS_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  dictionary: {},
  applicableForBrands: [],
};

const loading = () => ({
  type: LOADING
});

const success = ({ dictionary, applicableForBrands }) => ({
  type: SUCCESS,
  payload: { dictionary, applicableForBrands }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        dictionary: action.payload.dictionary,
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

export const fetchNielsenPackagings = () => dispatch => {
  dispatch(loading());

  return fetch(`${API_BASE_URL}/nielsen/packagings`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
