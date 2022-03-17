import {
  GET_CATEGORIES,
  GET_CATEGORY,
  CATEGORY_ERROR,
  CLEAR_CATEGORY,
  CATEGORY_DELETED,
} from '../actions/types';

const initialState = {
  category: null,
  categories: null,
  loading: true,
  error: {},
};

function categoryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CATEGORY: {
      return {
        ...state,
        category: payload,
        loading: false,
      };
    }
    case GET_CATEGORIES: {
      return {
        ...state,
        category: null,
        categories: payload,
        loading: false,
      };
    }
    case CATEGORY_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
        category: null,
        categories: [],
      };
    }
    case CLEAR_CATEGORY:
    case CATEGORY_DELETED: {
      return {
        ...state,
        category: null,
        categories: [],
      };
    }
    default:
      return state;
  }
}

export default categoryReducer;
