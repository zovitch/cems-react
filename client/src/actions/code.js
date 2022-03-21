import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_CODE,
  GET_CODES,
  CODE_ERROR,
  CLEAR_CODE,
  CODE_DELETED,
} from './types';

// Get Codes - codetype can be failure, repair or analysis
export const getCodes = (codetype) => async (dispatch) => {
  try {
    const res = await api.get(`/${codetype}codes`);

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
export const getCode = (codeId, codetype) => async (dispatch) => {
  try {
    const res = await api.get(`/${codetype}codes/${codeId}`);

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
export const createCode =
  (formData, navigate, creating = false, codeId, codetype) =>
  async (dispatch) => {
    try {
      let res = null;
      if (codeId) {
        res = await api.put(`/${codetype}codes/${codeId}`, formData);
      } else {
        res = await api.post(`/${codetype}codes`, formData);
      }
      dispatch({
        type: GET_CODE,
        payload: res.data,
      });
      dispatch(setAlert(creating ? 'Code Created' : 'Code Updated', 'success'));

      navigate(`/${codetype}codes`);
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
export const deleteCode = (codetype, codeId, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/${codetype}codes/${codeId}`);

      dispatch({ type: CLEAR_CODE });
      dispatch({ type: CODE_DELETED });
      dispatch(setAlert('The Code has been deleted', 'dark'));
      navigate(`/${codetype}codes`);
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CODE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
