import {
  GET_INVESTMENTS,
  GET_INVESTMENT,
  INVESTMENT_ERROR,
  CLEAR_INVESTMENT,
  INVESTMENT_DELETED,
} from '../actions/types';

const initialState = {
  investment: null,
  investments: [],
  loading: true,
  error: {},
};

function investmentReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_INVESTMENT: {
      return {
        ...state,
        investment: payload,
        loading: false,
      };
    }
    case GET_INVESTMENTS: {
      return {
        ...state,
        investments: payload,
        investment: null,
        loading: false,
      };
    }
    case INVESTMENT_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        investment: null,
        investments: [],
      };
    }
    case CLEAR_INVESTMENT:
    case INVESTMENT_DELETED: {
      return {
        ...state,
        investment: null,
        investments: [],
      };
    }
    default:
      return state;
  }
}

export default investmentReducer;
