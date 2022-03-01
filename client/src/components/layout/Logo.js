import React, { Fragment } from 'react';
import logo from '../../img/citel_logo.png';

export const Logo = () => (
  <Fragment>
    <img
      src={logo}
      style={{ width: '75px', margin: 'auto', display: 'block' }}
      alt='Logo'
    />
  </Fragment>
);
