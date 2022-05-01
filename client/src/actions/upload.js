// import axios from 'axios';
import api from '../utils/api';
import { setAlert } from './alert';
import { UPLOAD_SUCCESS, UPLOAD_FAIL } from './types';

export const postUpload = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: UPLOAD_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert('File Uploaded', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: UPLOAD_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    err.response.data.msg
      ? dispatch(setAlert(err.response.data.msg, 'danger'))
      : dispatch(setAlert(err.response.statusText, 'danger'));
  }
};
