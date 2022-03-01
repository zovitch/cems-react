import React, { Fragment } from 'react';
import logo from '../img/citel_logo.svg';

export const Logo = () => (
  <Fragment>
    <img
      src={logo}
      style={{ width: '96px', margin: 'auto', display: 'block' }}
      alt='Logo'
    />
  </Fragment>
);
