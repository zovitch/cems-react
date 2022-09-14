import api from '../utils/api';
import { setAlert } from './alert';
import {
  TECHNICALSUPPORT_ERROR,
  GET_TECHNICALSUPPORT,
  GET_TECHNICALSUPPORTS,
  TECHNICALSUPPORT_DELETED,
  CLEAR_TECHNICALSUPPORT,
} from './types';

// Get technicalsupports
export const getTechnicalSupports = (searchQuery) => async (dispatch) => {
  try {
    const res = await api.get('/technicalsupports' + searchQuery);
    console.log(searchQuery);
    dispatch({
      type: GET_TECHNICALSUPPORTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TECHNICALSUPPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get technicalsupport/:technicalsupportId
export const getTechnicalSupport = (technicalsupportId) => async (dispatch) => {
  try {
    const res = await api.get(`/technicalsupports/${technicalsupportId}`);

    dispatch({
      type: GET_TECHNICALSUPPORT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TECHNICALSUPPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or Update a TechnicalSupport
export const createTechnicalSupport =
  (formData, navigate, creating = false, technicalsupportId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (technicalsupportId) {
        res = await api.patch(
          `/technicalsupports/${technicalsupportId}`,
          formData,
        );
      } else {
        res = await api.post(`/technicalsupports/`, formData);
      }

      dispatch({
        type: GET_TECHNICALSUPPORT,
        payload: res.data,
      });
      dispatch(
        setAlert(
          creating ? 'TechnicalSupport Created' : 'TechnicalSupport Updated',
          'success',
        ),
      );

      navigate('/technicalsupports');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: TECHNICALSUPPORT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a TechnicalSupport
export const deleteTechnicalSupport =
  (technicalsupportId, navigate) => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete(`/technicalsupports/${technicalsupportId}`);

        dispatch({ type: CLEAR_TECHNICALSUPPORT });
        dispatch({ type: TECHNICALSUPPORT_DELETED });
        dispatch(setAlert('TechnicalSupport has been deleted', 'dark'));
        navigate('/technicalsupports');
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: TECHNICALSUPPORT_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
