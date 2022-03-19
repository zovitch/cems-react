import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import department from './department';
import location from './location';
import category from './category';
import failureCode from './code';
import repairCode from './code';
import analysisCode from './code';

export default combineReducers({
  alert,
  auth,
  user,
  department,
  location,
  category,
  failureCode,
  repairCode,
  analysisCode,
});
