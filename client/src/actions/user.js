import api from '../utils/api';
import { setAlert } from './alert';

import { GET_USER, USER_ERROR, UPDATE_USER, USER_LOADED } from './types';

// Get current user
export const getCurrentUser = () => async (dispatch) => {
  try {
    const res = await api.get('/users/me');

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update User
export const editUser = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.put('/users/me', formData);

    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    });
    // We need to reload the user, so the name and the avatar initials can be updated
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });

    dispatch(setAlert('User information updated', 'success'));
    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
