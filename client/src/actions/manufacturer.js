import api from '../utils/api';
import { setAlert } from './alert';
import {
  MANUFACTURER_ERROR,
  GET_MANUFACTURER,
  GET_MANUFACTURERS,
  MANUFACTURER_DELETED,
  CLEAR_MANUFACTURER,
} from './types';

// Get manufacturers
export const getManufacturers = () => async (dispatch) => {
  try {
    const res = await api.get('/manufacturers');

    dispatch({
      type: GET_MANUFACTURERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MANUFACTURER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get manufacturer/:manufacturerId
export const getManufacturer = (manufacturerId) => async (dispatch) => {
  try {
    const res = await api.get(`/manufacturers/${manufacturerId}`);

    dispatch({
      type: GET_MANUFACTURER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MANUFACTURER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or Update a Manufacturer
export const createManufacturer =
  (formData, navigate, creating = false, manufacturerId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (manufacturerId) {
        res = await api.put(`/manufacturers/${manufacturerId}`, formData);
      } else {
        res = await api.post(`/manufacturers/`, formData);
      }

      dispatch({
        type: GET_MANUFACTURER,
        payload: res.data,
      });
      dispatch(
        setAlert(
          creating ? 'Manufacturer Created' : 'Manufacturer Updated',
          'success'
        )
      );

      navigate('/manufacturers');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: MANUFACTURER_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Manufacturer
export const deleteManufacturer =
  (manufacturerId, navigate) => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete(`/manufacturers/${manufacturerId}`);

        dispatch({ type: CLEAR_MANUFACTURER });
        dispatch({ type: MANUFACTURER_DELETED });
        dispatch(setAlert('Manufacturer has been deleted', 'dark'));
        navigate('/manufacturers');
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: MANUFACTURER_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
