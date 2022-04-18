import {
  GET_FAILURECODES,
  GET_REPAIRCODES,
  GET_ANALYSISCODES,
  GET_CODE,
  CODE_ERROR,
  CLEAR_CODE,
  CODE_DELETED,
} from '../actions/types';

const initialState = {
  code: null,
  failureCodes: [],
  repairCodes: [],
  analysisCodes: [],
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
        failureCodes: [],
        repairCodes: [],
        analysisCodes: [],
        loading: false,
      };
    }
    case GET_FAILURECODES: {
      return {
        ...state,
        code: null,
        failureCodes: payload,
        loading: false,
      };
    }
    case GET_REPAIRCODES: {
      return {
        ...state,
        code: null,
        repairCodes: payload,
        loading: false,
      };
    }
    case GET_ANALYSISCODES: {
      return {
        ...state,
        code: null,
        analysisCodes: payload,
        loading: false,
      };
    }
    case CODE_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        code: null,
        failureCodes: [],
        repairCodes: [],
        analysisCodes: [],
      };
    }
    case CLEAR_CODE:
    case CODE_DELETED: {
      return {
        ...state,
        code: null,
        failureCodes: [],
        repairCodes: [],
        analysisCodes: [],
      };
    }
    default:
      return state;
  }
}

export default codeReducer;
