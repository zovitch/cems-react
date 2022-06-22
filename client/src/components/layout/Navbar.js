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
        <Link to='/create-r3'>
          <i className='fas fa-screwdriver'></i>{' '}
          <span className='hide-sm'>New R3</span>
        </Link>
      </li>
      <li>
        <Link to='/r3s/?applicantValidation=false'>
          <i className='fas fa-screwdriver-wrench'></i>{' '}
          <span className='hide-sm'>Pending R3</span>
        </Link>
      </li>
      <li>
        <Link to='/machines'>
          <i className='fas fa-clipboard-list'></i>{' '}
          <span className='hide-sm'>LFA</span>
        </Link>
      </li>
      <li>
        <Link to='/departments'>
          <i className='fas fa-briefcase'></i>
          <span className='hide-sm'> Departments</span>
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
          <Link to={`/users/${user._id}`}>
            <Avatar name={user.name} round={true} size='25' />
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
        <Link to='/create-r3'>
          <i className='fas fa-screwdriver'></i>{' '}
          <span className='hide-sm'>New R3</span>
        </Link>
      </li>
      <li>
        <Link to='/machines'>
          <i className='fas fa-clipboard-list'></i>{' '}
          <span className='hide-sm'>LFA</span>
        </Link>
      </li>
      {/* <li>
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
      </li> */}
      <li>
        <Link to='/login'>
          <i className='fas fa-user' /> <span className='hide-sm'>Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <Link to='/'>
        <Logo />
      </Link>
      <h4 className='hide-sm'>Citel Equipment & Machinery System</h4>

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
