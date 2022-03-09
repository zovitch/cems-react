import api from '../utils/api';
import { setAlert } from './alert';
import { GET_DEPARTMENT, GET_DEPARTMENTS, DEPARTMENT_ERROR } from './types';

// Get  departments/:trigram
export const getDepartment = (trigram) => async (dispatch) => {
  try {
    const res = await api.get(`/departments/${trigram}`);
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

// Create or Update Department
export const createDepartment =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const res = await api.post('/departments', formData);

      dispatch({
        type: GET_DEPARTMENT,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? 'Department Updated' : 'Department Created', 'success')
      );

      if (!edit) {
        navigate('/dashboard');
      }
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
