import {
  GET_MACHINES,
  GET_MACHINE,
  MACHINE_ERROR,
  CLEAR_MACHINE,
  MACHINE_DELETED,
} from '../actions/types';

const initialState = {
  machine: null,
  machines: [],
  loading: true,
  error: {},
};

function machineReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MACHINE: {
      return {
        ...state,
        machine: payload,
        loading: false,
      };
    }
    case GET_MACHINES: {
      return {
        ...state,
        machines: payload,
        machine: null,
        loading: false,
      };
    }
    case MACHINE_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        machine: null,
        machines: [],
      };
    }
    case CLEAR_MACHINE:
    case MACHINE_DELETED: {
      return {
        ...state,
        machine: null,
        machines: [],
      };
    }
    default:
      return state;
  }
}

export default machineReducer;
