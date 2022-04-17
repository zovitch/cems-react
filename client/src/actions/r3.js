import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_R3S,
  GET_NEWR3NUMBER,
  GET_R3,
  R3_ERROR,
  CLEAR_R3,
  R3_DELETED,
} from './types';

// Get all r3s
export const getR3s = () => async (dispatch) => {
  try {
    const res = await api.get('/r3s');
    dispatch({
      type: GET_R3S,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: R3_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get info on one r3
export const getR3 = (r3Id) => async (dispatch) => {
  try {
    const res = await api.get(`/r3s/${r3Id}`);

    dispatch({
      type: GET_R3,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: R3_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getNewR3Number = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/r3s/newR3Number', formData);

    dispatch({
      type: GET_NEWR3NUMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: R3_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create  or update R3
export const createR3 =
  (formData, navigate, creating = false, r3Id) =>
  async (dispatch) => {
    try {
      let res = null;
      if (r3Id) {
        res = await api.patch(`/r3s/${r3Id}`, formData);
      } else {
        res = await api.post('/r3s', formData);
      }

      dispatch({
        type: GET_R3,
        payload: res.data,
      });
      dispatch(
        setAlert(creating ? 'R3 added ' : 'R3 information updated', 'success')
      );
      navigate('/r3s');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: R3_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a R3
export const deleteR3 = (r3Id, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/r3s/${r3Id}`);

      dispatch({ type: CLEAR_R3 });
      dispatch({ type: R3_DELETED });
      dispatch(setAlert('R3 has been deleted', 'dark'));
      navigate('/r3s');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: R3_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
