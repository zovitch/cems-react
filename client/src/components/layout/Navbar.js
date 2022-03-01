import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
  return (
    <nav className='navbar bg-dark'>
      <Link to='/'>
        <Logo />
      </Link>
      <ul>
        <li>
          <Link to='/user'>
            <i className='fas fa-users hide-bg' />{' '}
            <span className='hide-sm'> Users</span>
          </Link>
        </li>
        <li>
          <Link to='/machines'>
            <i className='fas fa-gears hide-bg' />{' '}
            <span className='hide-sm'>Machines</span>
          </Link>
        </li>
        <li>
          <Link to='/register'>
            <i className='fas fa-user-plus hide-bg' />{' '}
            <span className='hide-sm'>Register</span>
          </Link>
        </li>
        <li>
          <Link to='/login'>
            <i className='fas fa-arrow-right-to-bracket' />{' '}
            <span className='hide-sm'>Login</span>
          </Link>
        </li>
      </ul>
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
