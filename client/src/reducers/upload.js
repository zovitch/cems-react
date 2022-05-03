import { UPLOAD_SUCCESS, UPLOAD_FAIL, CLEAR_UPLOAD } from '../actions/types';

const initialState = {
  uploadedFile: null,
  loading: true,
  error: {},
};

function uploadReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_SUCCESS: {
      return {
        ...state,
        uploadedFile: payload,
        loading: false,
      };
    }
    case UPLOAD_FAIL: {
      return {
        ...state,
        uploadedFile: null,
        error: payload,
        loading: false,
      };
    }
    case CLEAR_UPLOAD: {
      return {
        ...state,
        uploadedFile: null,
        loading: false,
      };
    }
    default:
      return state;
  }
}
export default uploadReducer;
