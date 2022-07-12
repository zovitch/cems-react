import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashBoardCard from '../layout/DashBoardCard';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  const listOfItemsOnLanding = [
    {
      name: 'R3 Repair',
      nameCN: '报修单',
      route: 'r3s',
      key: 'r3s',
      faLogo: 'fas fa-screwdriver-wrench',
    },
    {
      name: 'L.F.A.',
      nameCN: '固定资产一览表',
      route: 'machines',
      key: 'machines',
      faLogo: 'fas fa-clipboard-list',
    },
  ];

  return (
    <section className='landing'>
      <div className='dark-overlay '>
        <div className='container'>
          <h1 className='large text-light text-center py-3'>
            Citel Equipment & Machinery System
          </h1>

          {/* <div className='cards p-3'>
          {listOfItemsOnLanding.length > 1 &&
            listOfItemsOnLanding.map((i) => (
              <DashBoardCard key={i.key} item={i} />
            ))}
        </div> */}

          <div className='button text-center p-3'>
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
