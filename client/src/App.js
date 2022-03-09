import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-form/ProfileForm';
import DepartmentForm from './components/department-form/DepartmentForm';
import Departments from './components/departments/Departments';
import Department from './components/department/Department';
import ProfileDepartment from './components/profile/ProfileDepartment';

import { LOGOUT } from './actions/types';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/users' element={<Profiles />} />
          <Route exact path='/users/:id' element={<Profile />} />
          <Route exact path='/departments' element={<Departments />} />
          <Route exact path='/departments/:id' element={<Department />} />
          <Route
            exact
            path='/users/:user_id/departments/'
            element={<ProfileDepartment />}
          />
          <Route
            exact
            path='/dashboard'
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            exact
            path='/users/me'
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            exact
            path='/edit-profile'
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            exact
            path='/department'
            element={<PrivateRoute component={DepartmentForm} />}
          />
          <Route
            exact
            path='/edit-department'
            element={<PrivateRoute component={DepartmentForm} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
