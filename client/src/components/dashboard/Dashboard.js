import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../actions/user';

import DashBoardCard from '../layout/DashBoardCard';

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
      name: 'R3 Repair Application',
      nameCN: '报修单',
      route: 'r3s',
      key: 'r3s',
      faLogo: 'fas fa-screwdriver-wrench',
    },
    {
      name: 'A.F.A.',
      nameCN: '',
      route: 'afas',
      key: 'afas',
      faLogo: 'fas fa-pencil',
    },
    {
      name: 'L.F.A.',
      nameCN: '固定资产一览表',
      route: 'machines',
      key: 'machines',
      faLogo: 'fas fa-clipboard-list',
    },
    {
      name: 'investments',
      nameCN: '',
      route: 'investments',
      key: 'investments',
      faLogo: 'fas fa-sack-dollar',
    },
    {
      name: 'manufacturers',
      nameCN: '制造商',
      route: 'manufacturers',
      key: 'manufacturers',
      faLogo: 'fas fa-industry',
    },
    {
      name: 'Failure Codes',
      route: 'failurecodes',
      key: 'failurecodes',
      faLogo: 'fas fa-code',
      color: 'text-failure',
    },
    {
      name: 'Repair Codes',
      route: 'repaircodes',
      key: 'repaircodes',
      faLogo: 'fas fa-code',
      color: 'text-repair',
    },
    {
      name: 'Analysis Codes',
      route: 'analysiscodes',
      key: 'analysiscodes',
      faLogo: 'fas fa-code',
      color: 'text-analysis',
    },
    {
      name: 'Categories',
      nameCN: '类别',
      route: 'categories',
      key: 'categories',
      faLogo: 'fas fa-tags',
    },
    {
      name: 'Locations',
      nameCN: '位置',
      route: 'locations',
      key: 'locations',
      faLogo: 'fas fa-location',
    },
    {
      name: 'departments',
      nameCN: '申请部门',
      route: 'departments',
      key: 'departments',
      faLogo: 'fas fa-briefcase',
    },
    {
      name: 'Users',
      nameCN: '所有者',
      route: 'users',
      key: 'users',
      faLogo: 'fas fa-users',
    },
  ];
  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-gears'></i> Citel Equipment & Machinery System
      </h1>
      <div className='cards py-2'>
        {listOfItemsOnDashboard.length > 1 &&
          listOfItemsOnDashboard.map((i) => (
            <DashBoardCard key={i.key} item={i} />
          ))}
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
