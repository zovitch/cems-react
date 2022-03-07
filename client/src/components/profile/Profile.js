import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { getUserById } from '../../actions/user';
import { Link, useParams } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileDepartment from './ProfileDepartment';

const Profile = ({ getUserById, user: { user }, auth }) => {
  const { id } = useParams();

  useEffect(() => {
    getUserById(id);
  }, [getUserById, id]);

  return (
    <section className='container'>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
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
          <div className=' my-1'>
            <ProfileTop user={user} />
          </div>
          <div>
            <ProfileDepartment user={user} />
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profile.propTypes = {
  getUserById: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default connect(mapStateToProps, { getUserById })(Profile);
