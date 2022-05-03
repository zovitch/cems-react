import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_MACHINES,
  GET_NEWMACHINENUMBER,
  GET_MACHINE,
  MACHINE_ERROR,
  CLEAR_MACHINE,
  MACHINE_DELETED,
  CLEAR_UPLOAD,
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

// Get info on one machine
export const getMachine = (machineId) => async (dispatch) => {
  try {
    const res = await api.get(`/machines/${machineId}`);

    dispatch({
      type: GET_MACHINE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MACHINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getNewMachineNumber = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/machines/newMachineNumber', formData);

    dispatch({
      type: GET_NEWMACHINENUMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MACHINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create  or update Machine
export const createMachine =
  (formData, navigate, creating = false, machineId) =>
  async (dispatch) => {
    try {
      let res = null;
      if (machineId) {
        res = await api.patch(`/machines/${machineId}`, formData);
      } else {
        res = await api.post('/machines', formData);
      }

      dispatch({ type: CLEAR_UPLOAD });

      dispatch({
        type: GET_MACHINE,
        payload: res.data,
      });
      dispatch(
        setAlert(
          creating ? 'Machine added to the LFA' : 'Machine information updated',
          'success'
        )
      );
      navigate('/machines');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: MACHINE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete a Machine
export const deleteMachine = (machineId, navigate) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete(`/machines/${machineId}`);

      dispatch({ type: CLEAR_MACHINE });
      dispatch({ type: MACHINE_DELETED });
      dispatch(setAlert('Machine has been deleted', 'dark'));
      navigate('/machines');
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: MACHINE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
