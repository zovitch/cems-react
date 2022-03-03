import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser, editUser } from '../../actions/user';
/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */

const initialState = {
  name: '',
  department: [],
};

const ProfileForm = ({ auth: { user, loading }, getCurrentUser, editUser }) => {
  const [formData, setFormData] = useState(initialState);

  const { name } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) getCurrentUser();
    if (!loading && user) {
      const userData = { ...initialState };
      for (const key in user) {
        if (key in userData) userData[key] = user[key];
      }
      setFormData(userData);
    }
  }, [loading, editUser, getCurrentUser, user]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    editUser(formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-user' /> My Profile{' '}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text m'>Name</small>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
      </form>
    </section>
  );
};

ProfileForm.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, { editUser, getCurrentUser })(
  ProfileForm
);
