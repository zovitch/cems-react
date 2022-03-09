import api from '../utils/api';
import { setAlert } from './alert';
import { LOCATION_ERROR, GET_LOCATIONS } from './types';

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
