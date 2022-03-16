import api from '../utils/api';
import { setAlert } from './alert';
import {
  LOCATION_ERROR,
  GET_LOCATION,
  GET_LOCATIONS,
  LOCATION_DELETED,
  CLEAR_LOCATION,
} from './types';

// Get locations
export const getLocations = () => async (dispatch) => {
  try {
    const res = await api.get('/locations');
    dispatch({
      type: GET_LOCATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOCATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get location/:locationId
export const getLocation = (locationId) => async (dispatch) => {
  try {
    const res = await api.get(`/locations/${locationId}`);

    dispatch({
      type: GET_LOCATION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOCATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create Location
export const createLocation = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/locations', formData);

    dispatch({
      type: GET_LOCATION,
      payload: res.data,
    });
    dispatch(setAlert('Location Created', 'success'));

    navigate('/locations');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOCATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update Location
export const updateLocation =
  (locationId, formData, navigate) => async (dispatch) => {
    try {
      const res = await api.put(`/locations/${locationId}`, formData);

      dispatch({
        type: GET_LOCATION,
        payload: res.data,
      });
      dispatch(setAlert('Location Updated', 'success'));

      navigate('/locations');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: LOCATION_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Location
export const deleteLocation = (locationId, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/locations/${locationId}`);

      dispatch({ type: CLEAR_LOCATION });
      dispatch({ type: LOCATION_DELETED });
      dispatch(setAlert('Location has been deleted', 'dark'));
      navigate('/locations');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: LOCATION_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
