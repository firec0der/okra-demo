import { apiBase } from '../constants/api';

const LOADING = 'KANTAR/DATA_LOADING';
const SUCCESS = 'KANTAR/DATA_SUCCESS';
// const FAILURE = 'KANTAR/DATA_FAILURE';

const initialState = {
  isLoading: false,
  error: null,
  list: []
};

const loading = () => ({
  type: LOADING
});

const success = (data) => ({
  type: SUCCESS,
  payload: { list: data }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        list: action.payload.list,
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

export const fetchKantarData = ({ brandIds } = { brandIds: [] }) => dispatch => {
  dispatch(loading());

  const queryString = brandIds.map(id => `brandIds[]=${id}`).join('&');

  return fetch(`${apiBase}/kantar/data?${queryString}&areaIds[]=2`)
    .then(response => response.json())
    .then(json => dispatch(success(json)));
};
