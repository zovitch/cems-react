import api from '../utils/api';
import { setAlert } from './alert';

import { GET_USER, USER_ERROR } from './types';

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
