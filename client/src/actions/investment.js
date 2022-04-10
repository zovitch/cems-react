import api from '../utils/api';
import { setAlert } from './alert';
import {
  INVESTMENT_ERROR,
  GET_INVESTMENT,
  GET_INVESTMENTS,
  INVESTMENT_DELETED,
  CLEAR_INVESTMENT,
} from './types';

// Get investments
export const getInvestments = () => async (dispatch) => {
  try {
    const res = await api.get('/investments');

    dispatch({
      type: GET_INVESTMENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVESTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get investment/:investmentId
export const getInvestment = (investmentId) => async (dispatch) => {
  try {
    const res = await api.get(`/investments/${investmentId}`);

    dispatch({
      type: GET_INVESTMENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVESTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or Update a Investment
export const createInvestment =
  (formData, navigate, creating = false, investmentId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (investmentId) {
        res = await api.put(`/investments/${investmentId}`, formData);
      } else {
        res = await api.post(`/investments/`, formData);
      }

      dispatch({
        type: GET_INVESTMENT,
        payload: res.data,
      });
      dispatch(
        setAlert(
          creating ? 'Investment Created' : 'Investment Updated',
          'success'
        )
      );

      navigate('/investments');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: INVESTMENT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Investment
export const deleteInvestment =
  (investmentId, navigate) => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete(`/investments/${investmentId}`);

        dispatch({ type: CLEAR_INVESTMENT });
        dispatch({ type: INVESTMENT_DELETED });
        dispatch(setAlert('Investment has been deleted', 'dark'));
        navigate('/investments');
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: INVESTMENT_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
