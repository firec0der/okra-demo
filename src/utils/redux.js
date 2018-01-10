export const createReducer = (initialState, reducerMap = {}) =>
  (state = initialState, action = {}) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? { ...state, ...reducer(action.payload, state) }
      : state;
  };
