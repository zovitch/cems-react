import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_USER,
  GET_USERS,
  USER_ERROR,
  UPDATE_USER,
  USER_LOADED,
  ACCOUNT_DELETED,
  CLEAR_USER,
  GET_USERDEPARTMENTS,
  CLEAR_DEPARTMENT,
} from './types';

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

// Get all users
export const getUsers = () => async (dispatch) => {
  dispatch({ type: CLEAR_USER });
  try {
    const res = await api.get('/users');
    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get user by id
export const getUserById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/users/${userId}`);
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

// Delete a user
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete('/users/');

      dispatch({ type: CLEAR_USER });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert('Your account has been deleted', 'dark'));
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Get all departments for one user
export const getDepartmentsByUserId = (userId) => async (dispatch) => {
  dispatch({
    type: CLEAR_DEPARTMENT,
  });
  try {
    const res = await api.get(`/users/${userId}/departments`);
    dispatch({
      type: GET_USERDEPARTMENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
