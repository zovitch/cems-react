import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getDepartment,
  createDepartment,
  deleteDepartment,
} from '../../actions/department';
import { getLocations } from '../../actions/location';
import { getUsers } from '../../actions/user';
import Select from 'react-select';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */

const initialState = {
  trigram: '',
  name: '',
  nameCN: '',
  location: '',
  owners: [],
};

const DepartmentForm = ({
  getLocations,
  getUsers,
  createDepartment,
  getDepartment,
  deleteDepartment,
  user: { users },
  location: { locations },
  department: { department },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { departmentId } = useParams();
  let creatingDepartment = true;
  if (departmentId) creatingDepartment = false;

  useEffect(() => {
    !locations.length > 0 && getLocations();
  }, [getLocations, locations.length]);

  useEffect(() => {
    !users.length > 0 && getUsers();
  }, [getUsers, users.length]);

  useEffect(() => {
    !department && departmentId && getDepartment(departmentId);
  }, [department, departmentId, getDepartment]);

  useEffect(() => {
    if (department && !department.loading) {
      const departmentData = { ...initialState };
      for (const key in department) {
        if (key in departmentData) departmentData[key] = department[key];
      }
      setFormData(departmentData);
    }
  }, [department]);

  const defaultOwners = !formData.owners
    ? null
    : formData.owners.map((o) => ({
        value: o._id,
        label: o.name,
      }));

  const defaultLocation = !formData.location
    ? null
    : {
        value: formData.location._id,
        label: formData.location.name,
      };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Because we use <Select /> the onChange is a bit different
  const onChangeOwners = (e) => {
    const newValues = { ...formData };
    newValues.owners = e.map((item) => ({
      _id: item.value,
      name: item.label,
    }));
    setFormData(newValues);
  };

  // Because we use <Select /> the onChange is a bit different
  const onChangeLocation = (e) => {
    const newValues = { ...formData };
    newValues.location = {
      _id: e.value,
      name: e.label,
    };
    setFormData(newValues);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createDepartment(formData, navigate, creatingDepartment, departmentId);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-briefcase'></i>{' '}
        {creatingDepartment ? 'Create a new Department' : 'Edit Department'}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Trigram</small>
          <input
            type='text'
            placeholder='Trigram'
            name='trigram'
            value={formData.trigram}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={formData.name}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Name in Chinese</small>
          <input
            type='text'
            placeholder='Name in Chinese'
            name='nameCN'
            value={formData.nameCN}
            onChange={onChange}
          />
        </div>

        <Fragment>
          <div className='form-group'>
            <small className='form-text'>Owners</small>
            {users.length > 0 && (
              <Select
                name='owners'
                placeholder='Select the Owners'
                isMulti
                defaultValue={defaultOwners}
                key={defaultOwners}
                onChange={onChangeOwners}
                options={users.map((u) => ({ value: u._id, label: u.name }))}
                menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
              />
            )}
          </div>
        </Fragment>

        <div className='form-group'>
          <small className='form-text'>Location</small>
          {locations.length > 0 && (
            <Select
              name='location'
              placeholder='Select one Location'
              defaultValue={defaultLocation}
              key={formData.location && formData.location._id}
              onChange={onChangeLocation}
              options={locations.map((e) => ({ value: e._id, label: e.name }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/departments'>
          Go Back
        </Link>
      </form>
      {creatingDepartment === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteDepartment(departmentId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Department
            </button>
          </div>
        </>
      )}
    </section>
  );
};

DepartmentForm.propTypes = {
  getDepartment: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  createDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
  location: state.location,
  user: state.user,
});
export default connect(mapStateToProps, {
  getDepartment,
  getLocations,
  getUsers,
  createDepartment,
  deleteDepartment,
})(DepartmentForm);
