import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/departments'>
          <i className='fas fa-briefcase'></i>
          <span className='hide-sm'>Departments</span>
        </Link>
      </li>
      <li>
        <Link to='/users'>
          <i className='fas fa-users ' />{' '}
          <span className='hide-sm'> Users</span>
        </Link>
      </li>
      <li>
        {user && (
          <Link to='/edit-profile'>
            <Avatar
              name={user.name}
              round={true}
              size='25'
              textSizeRatio='1.2'
              maxInitials='3'
            />
          </Link>
        )}
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/departments'>
          <i className='fas fa-briefcase'></i>{' '}
          <span className='hide-sm'>Departments</span>
        </Link>
      </li>
      <li>
        <Link to='/users'>
          <i className='fas fa-users ' />{' '}
          <span className='hide-sm'> Users</span>
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i className='fas fa-user-plus ' />{' '}
          <span className='hide-sm'>Sign Up</span>
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i className='fas fa-right-to-bracket' />{' '}
          <span className='hide-sm'>Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <Link to='/'>
        <Logo />
      </Link>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
