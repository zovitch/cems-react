import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import department from './department';

export default combineReducers({ alert, auth, user, department });
