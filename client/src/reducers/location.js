import {
  GET_LOCATIONS,
  GET_LOCATION,
  LOCATION_ERROR,
  CLEAR_LOCATION,
  LOCATION_DELETED,
} from '../actions/types';

const initialState = {
  location: null,
  locations: [],
  loading: true,
  error: {},
};

function locationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LOCATION: {
      return {
        ...state,
        location: payload,
        loading: false,
      };
    }
    case GET_LOCATIONS: {
      return {
        ...state,
        locations: payload,
        location: null,
        loading: false,
      };
    }
    case LOCATION_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        location: null,
        locations: [],
      };
    }
    case CLEAR_LOCATION:
    case LOCATION_DELETED: {
      return {
        ...state,
        location: null,
        locations: [],
      };
    }
    default:
      return state;
  }
}

export default locationReducer;
