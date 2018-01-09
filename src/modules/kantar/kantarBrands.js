// imports from utils
import { getJson } from '../../utils/http';

// imports from constants
import { CORE_API_URL } from '../../constants/api';

const LOADING = 'KANTAR/BRANDS_LOADING';
const SUCCESS = 'KANTAR/BRANDS_SUCCESS';

const initialState = {
  isLoading: false,
  error: null,
  dictionary: {},
};

const loading = () => ({
  type: LOADING,
});

const success = ({ dictionary }) => ({
  type: SUCCESS,
  payload: { dictionary },
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        dictionary: action.payload.dictionary,
        isLoading: false,
        error: null,
      };
    case LOADING:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

export const fetchKantarBrands = () => (dispatch) => {
  dispatch(loading());

  return getJson(`${CORE_API_URL}/kantar/brands`)
    .then((data) => dispatch(success(data)));
};
