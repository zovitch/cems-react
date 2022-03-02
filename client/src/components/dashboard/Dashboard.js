import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
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
        <i className='fas fa-user' /> My Profile{' '}
      </h1>

      {user ? (
        <>
          <div className='lead '>
            <Avatar
              name={user.name}
              round={true}
              maxInitials='3'
              textSizeRatio='1.2'
              size='50'
            />
          </div>
          <div>{user.name}</div>
        </>
      ) : (
        <Avatar name='?' round={true} maxInitials='3' size='50' />
      )}
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
