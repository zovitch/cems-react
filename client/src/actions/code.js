import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_CODE,
  GET_CODES,
  CODE_ERROR,
  CLEAR_CODE,
  CODE_DELETED,
} from './types';

// Get Codes
export const getFailureCodes = () => async (dispatch) => {
  try {
    const res = await api.get('/failurecodes');

    dispatch({
      type: GET_CODES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CODE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Code/:codeId
export const getFailureCode = (codeId) => async (dispatch) => {
  console.log('getting failure code');
  try {
    const res = await api.get(`/failurecodes/${codeId}`);

    dispatch({
      type: GET_CODE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CODE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or Update a Code
export const createFailureCode =
  (formData, navigate, creating = false, codeId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (codeId) {
        res = await api.put(`/failurecodes/${codeId}`, formData);
      } else {
        res = await api.post('/failurecodes', formData);
      }
      dispatch({
        type: GET_CODE,
        payload: res.data,
      });
      dispatch(setAlert(creating ? 'Code Created' : 'Code Updated', 'success'));

      navigate('/failurecodes');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: CODE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Code
export const deleteFailureCode = (codeId, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/failurecodes/${codeId}`);

      dispatch({ type: CLEAR_CODE });
      dispatch({ type: CODE_DELETED });
      dispatch(setAlert('Failure Code has been deleted', 'dark'));
      navigate('/categories');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CODE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
