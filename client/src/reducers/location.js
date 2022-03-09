import { GET_LOCATIONS, LOCATION_ERROR } from '../actions/types';

const initialState = {
  location: null,
  locations: [],
  loading: true,
  error: {},
};

function locationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LOCATIONS: {
      return {
        ...state,
        locations: payload,
        loading: false,
      };
    }
    case LOCATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}

export default locationReducer;
