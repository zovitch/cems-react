import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { getDepartmentsByUserId, getUserById } from '../../actions/user';
import { Link, useParams } from 'react-router-dom';
import ProfileItem from '../profiles/ProfileItem';
import DepartmentItem from '../departments/DepartmentItem';

const Profile = ({
  getUserById,
  getDepartmentsByUserId,
  user: { user, departments },
  auth,
}) => {
  const { id } = useParams();

  useEffect(() => {
    getUserById(id);
    getDepartmentsByUserId(id);
  }, [getDepartmentsByUserId, getUserById, id]);

  console.log(user);
  console.log(departments);

  return (
    <section className='container'>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-user'></i> User
          </h1>
          <Link to='/users' className='btn btn-light'>
            Back to Users
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid py-2'>
            <div className='profile-info'>
              <div className='lead'>
                <i className='fas fa-user'></i> Profile
              </div>
              <ProfileItem user={user} />
            </div>
            <div className='profile-departments'>
              <div className='lead'>
                <i className='fas fa-briefcase'></i> Departments
              </div>
              <div className='departments'>
                {departments === null ? (
                  <Spinner />
                ) : (
                  departments &&
                  departments.length > 0 &&
                  departments.map((department) => (
                    <DepartmentItem
                      className='departments'
                      key={department._id}
                      department={department}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profile.propTypes = {
  getUserById: PropTypes.func.isRequired,
  getDepartmentsByUserId: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getUserById,
  getDepartmentsByUserId,
})(Profile);
