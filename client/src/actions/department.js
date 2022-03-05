import api from '../utils/api';
import { setAlert } from './alert';
import { GET_DEPARTMENT, GET_DEPARTMENTS, DEPARTMENT_ERROR } from './types';

// Get  departments/:trigram
export const getDepartment = (trigram) => async (dispatch) => {
  try {
    const res = await api.get(`/departments/${trigram}`);
    dispatch({
      type: GET_DEPARTMENT,
<<<<<<< HEAD
      payload: res.data,
=======
      paylload: res.data,
>>>>>>> a6388f7a246a8801ba360f96e42e8ae913782402
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
<<<<<<< HEAD
      payload: res.data,
=======
      paylload: res.data,
>>>>>>> a6388f7a246a8801ba360f96e42e8ae913782402
    });
  } catch (err) {
    dispatch({
      type: DEPARTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
