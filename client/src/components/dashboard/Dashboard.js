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
      name: 'R3 Repair',
      nameCN: '报修单',
      route: `r3s?from=${new Date().getFullYear()}-01-01`,
      key: 'r3s',
      faLogo: 'fas fa-screwdriver-wrench',
    },
    {
      name: 'Technical Support',
      nameCN: '技术协助需求',
      route: `technicalSupports`,
      key: 'technicalsupport',
      faLogo: 'fas fa-handshake-angle',
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
      nameCN: '预算',
      route: 'investments',
      key: 'investments',
      faLogo: 'fas fa-sack-dollar',
    },
    {
      name: 'Categories',
      nameCN: '类别',
      route: 'categories',
      key: 'categories',
      faLogo: 'fas fa-tags',
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

  const listOfItemsOnDashboardForEngineering = [
    {
      name: 'A.F.A.',
      nameCN: '',
      route: 'afas',
      key: 'afas',
      faLogo: 'fas fa-pencil',
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
      name: 'Locations',
      nameCN: '位置',
      route: 'locations',
      key: 'locations',
      faLogo: 'fas fa-location',
    },
    {
      name: 'manufacturers',
      nameCN: '制造商',
      route: 'manufacturers',
      key: 'manufacturers',
      faLogo: 'fas fa-industry',
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
            <DashBoardCard
              key={i.key}
              item={i}
            />
          ))}
      </div>
      {user && user.isEngineer && (
        <span>
          <hr />
          <br />
          <h1>Engineering Section</h1>
          <div className='cards py-2'>
            {listOfItemsOnDashboardForEngineering.length > 1 &&
              listOfItemsOnDashboardForEngineering.map((i) => (
                <DashBoardCard
                  key={i.key}
                  item={i}
                />
              ))}
          </div>
        </span>
      )}
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
