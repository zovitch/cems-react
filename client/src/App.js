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
import Locations from './components/locations/Locations';
import Location from './components/location/Location';
import LocationForm from './components/location-form/LocationForm';
import Categories from './components/categories/Categories';
import Category from './components/category/Category';
import CategoryForm from './components/category-form/CategoryForm';
import Codes from './components/codes/Codes';
import CodeForm from './components/code-form/CodeForm';
import Manufacturer from './components/manufacturer/Manufacturer';
import Manufacturers from './components/manufacturers/Manufacturers';
import ManufacturerForm from './components/manufacturer-form/ManufacturerForm';
import Machines from './components/machines/Machines';
import MachineForm from './components/machine-form/MachineForm';
// import Machine from './components/machines/Machine';

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
          <Route exact path='/locations' element={<Locations />} />
          <Route exact path='/locations/:locationId' element={<Location />} />
          <Route exact path='/machines' element={<Machines />} />
          {/* <Route exact path='/machines/:machineId' element={<Machine />} /> */}
          <Route exact path='/manufacturers' element={<Manufacturers />} />
          <Route
            exact
            path='/manufacturers/:manufacturerId'
            element={<Manufacturer />}
          />
          <Route exact path='/departments' element={<Departments />} />
          <Route
            exact
            path='/departments/:departmentId'
            element={<Department />}
          />
          <Route exact path='/categories' element={<Categories />} />
          <Route exact path='/categories/:categoryId' element={<Category />} />
          <Route
            exact
            path='/failurecodes'
            element={<Codes codetype='failure' />}
          />{' '}
          <Route
            exact
            path='/repaircodes'
            element={<Codes codetype='repair' />}
          />{' '}
          <Route
            exact
            path='/analysiscodes'
            element={<Codes codetype='analysis' />}
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
            path='/create-machine'
            element={<PrivateRoute component={MachineForm} />}
          />
          <Route
            exact
            path='/create-location'
            element={<PrivateRoute component={LocationForm} />}
          />
          <Route
            exact
            path='/create-manufacturer'
            element={<PrivateRoute component={ManufacturerForm} />}
          />
          <Route
            exact
            path='/create-department'
            element={<PrivateRoute component={DepartmentForm} />}
          />
          <Route
            exact
            path='/create-category'
            element={<PrivateRoute component={CategoryForm} />}
          />
          <Route
            exact
            path='/create-failurecode'
            element={<PrivateRoute component={CodeForm} codetype='failure' />}
          />
          <Route
            exact
            path='/create-repaircode'
            element={<PrivateRoute component={CodeForm} codetype='repair' />}
          />{' '}
          <Route
            exact
            path='/create-analysiscode'
            element={<PrivateRoute component={CodeForm} codetype='analysis' />}
          />
          <Route
            exact
            path='/edit-profile'
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            exact
            path='/locations/edit/:locationId'
            element={<PrivateRoute component={LocationForm} />}
          />
          <Route
            exact
            path='/manufacturers/edit/:manufacturerId'
            element={<PrivateRoute component={ManufacturerForm} />}
          />
          <Route
            exact
            path='/departments/edit/:departmentId'
            element={<PrivateRoute component={DepartmentForm} />}
          />
          <Route
            exact
            path='/categories/edit/:categoryId'
            element={<PrivateRoute component={CategoryForm} />}
          />
          <Route
            exact
            path='/failurecodes/edit/:codeId'
            element={<PrivateRoute component={CodeForm} codetype='failure' />}
          />{' '}
          <Route
            exact
            path='/repaircodes/edit/:codeId'
            element={<PrivateRoute component={CodeForm} codetype='repair' />}
          />
          <Route
            exact
            path='/analysiscodes/edit/:codeId'
            element={<PrivateRoute component={CodeForm} codetype='analysis' />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
