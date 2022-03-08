import {
  CLEAR_USER,
  GET_USER,
  GET_USERS,
  UPDATE_USER,
  USER_ERROR,
  GET_USERDEPARTMENTS,
} from '../actions/types';

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
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case USER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        user: null,
        departments: null,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
        departments: null,
      };
    case GET_USERDEPARTMENTS:
      return {
        ...state,
        departments: payload,
        loading: false,
      };
    default:
      return state;
  }
}

export default userReducer;
