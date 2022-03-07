import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDepartmentsByUserId } from '../../actions/user';

const ProfileDepartment = ({
  getDepartmentsByUserId,
  user: { user, departments },
}) => {
  useEffect(() => {
    getDepartmentsByUserId(user._id);
  }, [getDepartmentsByUserId, user._id]);
  return (
    <div className='post bg-light p-1'>
      <ul>
        {departments.map((department) => (
          <li key={department._id}>• {department.trigram}</li>
        ))}
      </ul>
    </div>
  );
};

ProfileDepartment.propTypes = {
  getDepartmentsByUserId: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, { getDepartmentsByUserId })(
  ProfileDepartment
);
