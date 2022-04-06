import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashBoardCard from '../layout/DashBoardCard';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  const listOfItemsOnLanding = [
    {
      name: 'R3 Repair Application',
      nameCN: '报修单',
      route: 'machines',
      key: 'machines',
      faLogo: 'fas fa-screwdriver',
      color: 'text-failure',
    },
    {
      name: 'List of Pending R3',
      nameCN: '报修单',
      route: 'machines',
      key: 'machines2',
      faLogo: 'fas fa-screwdriver-wrench',
      color: 'text-failure',
    },
  ];

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        {/* <div className=' py-3'> */}
        {/* <h1 className='x-large'>Citel Equipment & Machinery System</h1> */}
        <div className='cards p-3'>
          {listOfItemsOnLanding.length > 1 &&
            listOfItemsOnLanding.map((i) => (
              <DashBoardCard key={i.key} item={i} />
            ))}
        </div>
        {/* <p className='lead'>Add some element for Machines</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              <i className='fas fa-user-plus' />{' '}
              <span className='hide-sm'>Sign Up</span>
            </Link>
            <Link to='/login' className='btn btn-light'>
              <i className='fas fa-right-to-bracket' />{' '}
              <span className='hide-sm'>Login</span>
            </Link>
          </div> */}
      </div>
      {/* </div> */}
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
