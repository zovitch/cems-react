import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDepartmentsByUserId } from '../../actions/user';
import { Link } from 'react-router-dom';

const ProfileDepartment = ({
  getDepartmentsByUserId,
  user: { user, departments },
}) => {
  useEffect(() => {
    getDepartmentsByUserId(user._id);
  }, [getDepartmentsByUserId, user._id]);
  return (
    <div className='post bg-light p-1'>
      {departments.length > 0 &&
        departments.map((department) => (
          <Link to={`/departments/${department.trigram}`}>
            {department.trigram}
          </Link>
        ))}
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
