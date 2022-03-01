import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <Link to='/'>
        <Logo />
      </Link>
      <ul>
        <li>
          <Link to='/machines'>Machines</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  );
};
