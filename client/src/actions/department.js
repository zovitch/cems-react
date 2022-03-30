import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_DEPARTMENT,
  GET_DEPARTMENTS,
  DEPARTMENT_ERROR,
  DEPARTMENT_DELETED,
  CLEAR_DEPARTMENT,
} from './types';

// Get all departments
export const getDepartments = () => async (dispatch) => {
  try {
    const res = await api.get('/departments');
    dispatch({
      type: GET_DEPARTMENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DEPARTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get  departments/:departmentId
export const getDepartment = (departmentId) => async (dispatch) => {
  try {
    const res = await api.get(`/departments/${departmentId}`);
    dispatch({
      type: GET_DEPARTMENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DEPARTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create Department
export const createDepartment =
  (formData, navigate, creating = false, departmentId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (departmentId) {
        res = await api.put(`/departments/${departmentId}`, formData);
      } else {
        res = await api.post('/departments', formData);
      }

      dispatch({
        type: GET_DEPARTMENT,
        payload: res.data,
      });
      dispatch(
        setAlert(
          creating ? 'Department Created' : 'Department Updated',
          'success'
        )
      );

      navigate('/departments');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: DEPARTMENT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Department
export const deleteDepartment =
  (departmentId, navigate) => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete(`/departments/${departmentId}`);
        dispatch({ type: CLEAR_DEPARTMENT });
        dispatch({ type: DEPARTMENT_DELETED });
        dispatch(setAlert('Department has been deleted', 'dark'));
        navigate('/departments');
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: DEPARTMENT_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
