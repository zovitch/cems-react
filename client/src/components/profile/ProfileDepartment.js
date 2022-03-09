import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDepartmentsByUserId } from '../../actions/user';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';

const ProfileDepartment = ({
  getDepartmentsByUserId,
  user: { user, departments, loading },
}) => {
  useEffect(() => {
    getDepartmentsByUserId(user._id);
  }, [getDepartmentsByUserId, user._id]);
  return (
    <ul className='post bg-light p-1'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {departments &&
            departments.length > 0 &&
            departments.map((department) => (
              <li key={department._id}>
                <Link
                  className='lead m'
                  to={`/departments/${department.trigram}`}
                >
                  {department.trigram}
                </Link>
              </li>
            ))}
        </Fragment>
      )}
    </ul>
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
