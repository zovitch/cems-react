import {
  GET_MANUFACTURERS,
  GET_MANUFACTURER,
  MANUFACTURER_ERROR,
  CLEAR_MANUFACTURER,
  MANUFACTURER_DELETED,
} from '../actions/types';

const initialState = {
  manufacturer: null,
  manufacturers: [],
  loading: true,
  error: {},
};

function manufacturerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MANUFACTURER: {
      return {
        ...state,
        manufacturer: payload,
        loading: false,
      };
    }
    case GET_MANUFACTURERS: {
      return {
        ...state,
        manufacturers: payload,
        manufacturer: null,
        loading: false,
      };
    }
    case MANUFACTURER_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        manufacturer: null,
        manufacturers: [],
      };
    }
    case CLEAR_MANUFACTURER:
    case MANUFACTURER_DELETED: {
      return {
        ...state,
        manufacturer: null,
        manufacturers: [],
      };
    }
    default:
      return state;
  }
}

export default manufacturerReducer;
