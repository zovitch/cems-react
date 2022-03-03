import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../actions/user';

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

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i class='fa-solid fa-list-check'></i> Dashboard
      </h1>
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, { getCurrentUser })(Dashboard);
