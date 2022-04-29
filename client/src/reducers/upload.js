import { UPLOAD_SUCCESS, UPLOAD_FAIL } from '../actions/types';

const initialState = {
  uploadfile: null,
  loading: true,
  error: {},
};

function uploadReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPLOAD_SUCCESS: {
      return {
        ...state,
        uploadfile: payload,
        loading: false,
      };
    }
    case UPLOAD_FAIL: {
      return {
        ...state,
        uploadfile: null,
        error: payload,
        loading: false,
      };
    }
    default:
      return state;
  }
}
export default uploadReducer;
