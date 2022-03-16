import {
  GET_DEPARTMENT,
  GET_DEPARTMENTS,
  DEPARTMENT_ERROR,
  CLEAR_DEPARTMENT,
  DEPARTMENT_DELETED,
} from '../actions/types';

const initialState = {
  department: null,
  departments: [],
  loading: true,
  error: {},
};

function departmentReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DEPARTMENT: {
      return {
        ...state,
        department: payload,
        loading: false,
      };
    }
    case GET_DEPARTMENTS: {
      return {
        ...state,
        department: null,
        departments: payload,
        loading: false,
      };
    }
    case DEPARTMENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        department: null,
        departments: [],
      };
    case CLEAR_DEPARTMENT:
    case DEPARTMENT_DELETED:
      return {
        ...state,
        department: null,
        departments: [],
      };

    default:
      return state;
  }
}

export default departmentReducer;
