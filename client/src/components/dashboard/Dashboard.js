import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../actions/user';

import DashBoardCard from '../layout/DashBoardCard';
import AddNew from '../layout/AddNew';

// Check if user hit back button from an unauthenticated state and force reload to update browser cache
const perfEntries = performance.getEntriesByType('navigation');
if (perfEntries.length && perfEntries[0].type === 'back_forward') {
  if (localStorage.getItem('token') === null) {
    window.location.reload();
  }
}

const Dashboard = ({ getCurrentUser, auth: { user } }) => {
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const listOfItemsOnDashboard = [
    {
      name: 'manufacturers',
      nameCN: '制造商',
      route: 'manufacturers',
      faLogo: 'fas fa-industry',
    },
    {
      name: 'Failure Codes',
      route: 'failurecodes',
      faLogo: 'fas fa-code',
      color: 'text-failure',
    },
    {
      name: 'Repair Codes',
      route: 'repaircodes',
      faLogo: 'fas fa-code',
      color: 'text-repair',
    },
    {
      name: 'Analysis Codes',
      route: 'analysiscodes',
      faLogo: 'fas fa-code',
      color: 'text-analysis',
    },
    {
      name: 'Categories',
      nameCN: '类别',
      route: 'categories',
      faLogo: 'fas fa-tags',
    },
    {
      name: 'Locations',
      nameCN: '位置',
      route: 'locations',
      faLogo: 'fas fa-location',
    },
    {
      name: 'departments',
      nameCN: '申请部门',
      route: 'departments',
      faLogo: 'fas fa-briefcase',
    },
    {
      name: 'Users',
      nameCN: '所有者',
      route: 'departments',
      faLogo: 'fas fa-users',
    },
  ];
  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fa-solid fa-list-check'></i> Citel Equipment & Machinery
        System
      </h1>
      <div className='cards py-2'>
        {listOfItemsOnDashboard.length > 1 &&
          listOfItemsOnDashboard.map((i) => <DashBoardCard item={i} />)}
      </div>
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentUser })(Dashboard);
