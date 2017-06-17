import { apiBase } from '../../constants/api';

const LOADING = 'NIELSEN/APPLIERS_LOADING';
const SUCCESS = 'NIELSEN/APPLIERS_SUCCESS';

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

export const fetchNielsenAppliers = () => dispatch => {
  dispatch(loading());

  return fetch(`${apiBase}/nielsen/appliers`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
