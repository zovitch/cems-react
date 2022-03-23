import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_MACHINES,
  GET_MACHINE,
  MACHINE_ERROR,
  CLEAR_MACHINE,
  MACHINE_DELETED,
} from './types';

// Get all machines
export const getMachines = () => async (dispatch) => {
  try {
    const res = await api.get('/machines');
    dispatch({
      type: GET_MACHINES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MACHINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
