import { API_BASE_URL } from '../../constants/api';

const LOADING = 'NWB/MANUFACTURERS_LOADING';
const SUCCESS = 'NWB/MANUFACTURERS_SUCCESS';

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

export const fetchNwbManufacturers = () => dispatch => {
  dispatch(loading());

  return fetch(`${API_BASE_URL}/nwb/manufacturers`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
