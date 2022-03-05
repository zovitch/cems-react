import {
  GET_DEPARTMENT,
  GET_DEPARTMENTS,
  DEPARTMENT_ERROR,
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
      };
    default:
      return state;
  }
}

export default departmentReducer;
