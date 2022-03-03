import { GET_USER, UPDATE_USER, USER_ERROR } from '../actions/types';

const initialState = {
  user: null,
  users: [],
  departments: [],
  loading: true,
  error: {},
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
    case UPDATE_USER:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case USER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}

export default userReducer;
