import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import setAlert from '../../actions/alert';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // destructuring
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('success');
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Sign in</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Sign into your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
          <small className='form-text'></small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>{' '}
      </p>
    </section>
  );
};

export default connect(null, { setAlert })(Login);
