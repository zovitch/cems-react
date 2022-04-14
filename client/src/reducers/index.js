import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import department from './department';
import location from './location';
import category from './category';
// import failureCode from './code';
// import repairCode from './code';
// import analysisCode from './code';
import code from './code'; // we can use only this for all failure, repair and analysis
import manufacturer from './manufacturer';
import machine from './machine';
import investment from './investment';
import r3 from './r3';

export default combineReducers({
  alert,
  auth,
  user,
  department,
  location,
  category,
  // failureCode,
  // repairCode,
  // analysisCode,
  code,
  manufacturer,
  machine,
  investment,
  r3,
});
