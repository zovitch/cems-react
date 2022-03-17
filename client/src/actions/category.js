import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_CATEGORY,
  GET_CATEGORIES,
  CATEGORY_ERROR,
  CLEAR_CATEGORY,
  CATEGORY_DELETED,
} from './types';

// Get Categories
export const getCategories = () => async (dispatch) => {
  try {
    const res = await api.get('/categories');

    dispatch({
      type: GET_CATEGORIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get categories/:categoryId
export const getCategory = (categoryId) => async (dispatch) => {
  try {
    const res = await api.get(`/categories/${categoryId}`);
    dispatch({
      type: GET_CATEGORY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create Category
export const createCategory = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/categories', formData);

    dispatch({
      type: GET_CATEGORY,
      payload: res.data,
    });
    dispatch(setAlert('Category Created', 'success'));
    navigate('/categories');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: CATEGORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a Category
export const deleteCategory = (categoryId, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/categories/${categoryId}`);

      dispatch({ type: CLEAR_CATEGORY });
      dispatch({ type: CATEGORY_DELETED });
      dispatch(setAlert('Category has been deleted', 'dark'));
      navigate('/categories');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CATEGORY_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
