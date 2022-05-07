// import axios from 'axios';
import api from '../utils/api';
import { useState } from 'react';
import { setAlert } from './alert';
import { UPLOAD_SUCCESS, UPLOAD_FAIL } from './types';

export const addFile = (formData) => async (dispatch) => {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  try {
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );

        //Clear percentage
        setTimeout(() => {
          setUploadPercentage(0);
        }, 10000);
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
