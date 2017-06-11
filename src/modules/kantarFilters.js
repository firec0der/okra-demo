const LOADING = 'KANTAR/FILTERS_LOADING';
const SUCCESS = 'KANTAR/FILTERS_SUCCESS';
// const FAILURE = 'KANTAR/FILTERS_FAILURE';

const initialState = {
  isLoading: false,
  error: null,
  dictionary: null
};

const loading = () => ({
  type: LOADING
});

const success = ({ dictionary, list }) => ({
  type: SUCCESS,
  payload: { dictionary, list }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        dictionary: action.payload.dictionary,
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

export const fetchKantarFilters = () => dispatch => {
  dispatch(loading());

  return fetch('http://localhost:8089/api/kantar/filters')
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
