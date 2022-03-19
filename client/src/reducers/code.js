import {
  GET_CODES,
  GET_CODE,
  CODE_ERROR,
  CLEAR_CODE,
  CODE_DELETED,
} from '../actions/types';

const initialState = {
  code: null,
  codes: null,
  loading: true,
  error: {},
};

function codeReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CODE: {
      return {
        ...state,
        code: payload,
        loading: false,
      };
    }
    case GET_CODES: {
      return {
        ...state,
        code: null,
        codes: payload,
        loading: false,
      };
    }
    case CODE_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        code: null,
        codes: [],
      };
    }
    case CLEAR_CODE:
    case CODE_DELETED: {
      return {
        ...state,
        code: null,
        codes: [],
      };
    }
    default:
      return state;
  }
}

export default codeReducer;
