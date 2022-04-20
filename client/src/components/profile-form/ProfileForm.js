import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser, editUser, deleteAccount } from '../../actions/user';
/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */

const initialState = {
  name: '',
  email: '',
};

const ProfileForm = ({
  auth: { user, loading },
  getCurrentUser,
  editUser,
  deleteAccount,
}) => {
  const [formData, setFormData] = useState(initialState);

  const { name, email } = formData;

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
  }, [getCurrentUser, loading, user]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    editUser(formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-user' /> My Profile
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text '>Name</small>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <small className='form-text '>E-mail</small>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            disabled
          />
        </div>

        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/users'>
          Go Back
        </Link>
      </form>
      <div className='line' />
      <div className='my-2 text-center'>
        <button className='btn btn-danger' onClick={() => deleteAccount()}>
          <i className='fas fa-trash' /> Delete My Account
        </button>
      </div>
    </section>
  );
};

ProfileForm.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  editUser,
  getCurrentUser,
  deleteAccount,
})(ProfileForm);
