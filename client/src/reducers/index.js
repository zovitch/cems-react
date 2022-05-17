import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import department from './department';
import location from './location';
import category from './category';
import code from './code'; // we cannot use only one state, because in R3 we need all 3 at once
import manufacturer from './manufacturer';
import machine from './machine';
import investment from './investment';
import r3 from './r3';
// import upload from './upload';

export default combineReducers({
  alert,
  auth,
  user,
  department,
  location,
  category,
  code,
  manufacturer,
  machine,
  investment,
  r3,
  // upload,
});
