// imports from utils
import { getJson } from '../../utils/http';

// imports from constants
import { CORE_API_URL } from '../../constants/api';

const LOADING = 'NIELSEN/CHANNELS_LOADING';
const SUCCESS = 'NIELSEN/CHANNELS_SUCCESS';

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

export const fetchNielsenChannels = () => (dispatch) => {
  dispatch(loading());

  return getJson(`${CORE_API_URL}/nielsen/channels`)
    .then(({ data }) => dispatch(success(data)));
};
