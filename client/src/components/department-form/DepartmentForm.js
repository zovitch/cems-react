import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDepartment, createDepartment } from '../../actions/department';
/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */

const initialState = {
  trigram: '',
  name: '',
  location: '',
};

const DepartmentForm = ({
  getDepartment,
  createDepartment,
  department: { department, loading },
}) => {
  const [formData, setFormData] = useState(initialState);

  const { trigram, name, location } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!department) getDepartment();
    if (!loading && department) {
      const departmentData = { ...initialState };
      for (const key in department) {
        if (key in departmentData) departmentData[key] = department[key];
      }
      // if the owners is an array from the API response
      //   if (Array.isArray(owners))
      //     departmentData.owners = departmentData.owners.join(', ');
      setFormData(departmentData);
    }
  }, [department, getDepartment, loading]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createDepartment(formData, navigate, department ? true : false);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-briefcase'></i> Edit Department
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Trigram</small>
          <input
            type='text'
            placeholder='Trigram'
            name='trigram'
            value={trigram}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Location</small>

          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location.name}
            onChange={onChange}
            disabled
          />
        </div>

        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/departments'>
          Go Back
        </Link>
      </form>
      <div className='line' />
      <div className='my-2 text-center'>
        <button className='btn btn-danger'>
          <i className='fas fa-user-minus' /> Delete the Department
        </button>
      </div>
    </section>
  );
};

DepartmentForm.propTypes = {
  department: PropTypes.object.isRequired,
  getDepartment: PropTypes.func.isRequired,
  createDepartment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});
export default connect(mapStateToProps, { getDepartment, createDepartment })(
  DepartmentForm
);
