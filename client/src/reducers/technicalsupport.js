import {
  GET_TECHNICALSUPPORTS,
  GET_TECHNICALSUPPORT,
  TECHNICALSUPPORT_ERROR,
  CLEAR_TECHNICALSUPPORT,
  TECHNICALSUPPORT_DELETED,
} from '../actions/types';

const initialState = {
  technicalsupport: null,
  technicalsupports: [],
  loading: true,
  error: {},
};

function technicalSupportReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TECHNICALSUPPORT: {
      return {
        ...state,
        technicalsupport: payload,
        loading: false,
      };
    }
    case GET_TECHNICALSUPPORTS: {
      return {
        ...state,
        technicalsupports: payload,
        technicalsupport: null,
        loading: false,
      };
    }
    case TECHNICALSUPPORT_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        technicalsupport: null,
        technicalsupports: [],
      };
    }
    case CLEAR_TECHNICALSUPPORT:
    case TECHNICALSUPPORT_DELETED: {
      return {
        ...state,
        technicalsupport: null,
        technicalsupports: [],
      };
    }
    default:
      return state;
  }
}

export default technicalSupportReducer;
