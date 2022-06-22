import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { getDepartmentsByUserId, getUserById } from '../../actions/user';
import { useParams } from 'react-router-dom';
import ProfileItem from '../profiles/ProfileItem';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
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

  return (
    <section className='container'>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='user' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-user'></i> Profile
              </div>
              <ProfileItem user={user} />
            </div>
            <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-briefcase'></i> Departments
              </div>
              <div className='cards'>
                {departments === null ? (
                  <Spinner />
                ) : (
                  departments &&
                  departments.length > 0 &&
                  departments.map((department) => (
                    <DepartmentItem
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
