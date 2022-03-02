import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Citel Equipment and Machinery System</h1>
          <p className='lead'>Add some element for Machines</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              <i className='fas fa-user-plus' />{' '}
              <span className='hide-sm'>Sign Up</span>
            </Link>
            <Link to='/login' className='btn btn-light'>
              <i className='fas fa-right-to-bracket' />{' '}
              <span className='hide-sm'>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
