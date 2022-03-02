import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
  // by default a name registered would be 2 or 3 initials, but in case someone register wiht only one name
  // there would be only 1 initial, so we need to increate the ratio textSizeRation for the avatar
  // to avoid the single letter displaying too big
  let textRatio = 0.8;
  if (user) {
    const wordCount = user.name.match(/(\w+)/g).length;
    textRatio = wordCount < 2 ? 1 : 0.8;
  }

  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/user'>
          <i className='fas fa-users ' />{' '}
          <span className='hide-sm'> Users</span>
        </Link>
      </li>
      <li>
        {user && (
          <Avatar
            name={user.name}
            value='8%'
            round={true}
            size='25'
            textSizeRatio={textRatio}
            maxInitials='3'
          />
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
