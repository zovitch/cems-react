import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDepartmentsByUserId } from '../../actions/user';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import DepartmentItem from '../departments/DepartmentItem';

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
          <div className=''>
            {departments && departments.length > 0 ? (
              departments.map((department) => (
                <Link
                  key={department._id}
                  to={`/departments/${department.trigram}`}
                >
                  <DepartmentItem
                    key={department._id}
                    department={department}
                  />
                </Link>
              ))
            ) : (
              <h4>No department found</h4>
            )}
          </div>{' '}
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
