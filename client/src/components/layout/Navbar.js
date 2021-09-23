import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> CEMS
        </Link>
      </h1>
      <ul>
        <li>
          <a href='profiles.html'>R3</a>
        </li>
        <li>
          <a href='profiles.html'>AFA</a>
        </li>
        <li>
          <a href='profiles.html'>RFA</a>
        </li>
        <li>
          <a href='profiles.html'>M2</a>
        </li>
        <li>
          <a href='profiles.html'>Machines</a>
        </li>
        <li>
          <a href='profiles.html'>Departments</a>
        </li>
        <li>
          <a href='profiles.html'>Investments</a>
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

export default Navbar;
