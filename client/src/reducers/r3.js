import {
  GET_R3S,
  GET_R3,
  GET_NEWR3NUMBER,
  R3_ERROR,
  CLEAR_R3,
  R3_DELETED,
} from '../actions/types';

const initialState = {
  r3: null,
  newR3Number: null,
  r3s: [],
  loading: true,
  error: {},
};

function r3Reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_R3:
      return {
        ...state,
        r3: payload.r3,
        r3s: payload.relatedR3s,
        loading: false,
      };

    case GET_R3S:
      return {
        ...state,
        r3s: payload,
        r3: null,
        newR3Number: null,
        loading: false,
      };

    case GET_NEWR3NUMBER:
      return {
        ...state,
        newR3Number: payload,
        loading: false,
      };

    case R3_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        newR3Number: null,
        r3: null,
        r3s: [],
      };

    case CLEAR_R3:
    case R3_DELETED:
      return {
        ...state,
        r3: null,
        newR3Number: null,
        r3s: [],
      };

    default:
      return state;
  }
}

export default r3Reducer;
