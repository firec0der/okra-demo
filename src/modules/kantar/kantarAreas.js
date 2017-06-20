import { API_BASE_URL } from '../../constants/api';

const LOADING = 'KANTAR/AREAS_LOADING';
const SUCCESS = 'KANTAR/AREAS_SUCCESS';

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

export const fetchKantarAreas = () => dispatch => {
  dispatch(loading());

  return fetch(`${API_BASE_URL}/kantar/areas`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
