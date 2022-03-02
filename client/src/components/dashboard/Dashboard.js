import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../actions/user';

const Dashboard = ({ getCurrentUser, auth, user }) => {
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return <div>Dashboard</div>;
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
