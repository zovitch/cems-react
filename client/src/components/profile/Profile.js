import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { getDepartmentsByUserId, getUserById } from '../../actions/user';
import { useParams, Link } from 'react-router-dom';
import ProfileItem from '../profiles/ProfileItem';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import DepartmentItem from '../departments/DepartmentItem';
import { getR3s } from '../../actions/r3';

const Profile = ({
  getUserById,
  getDepartmentsByUserId,
  getR3s,
  user: { user, departments },
  r3: { r3s },
  auth,
}) => {
  const { id } = useParams();

  useEffect(() => {
    getUserById(id);
    getDepartmentsByUserId(id);
  }, [getDepartmentsByUserId, getUserById, id]);

  useEffect(() => {
    getR3s(`?repairEngineer=${id}`);
  }, [getR3s, id]);

  return (
    <section className='container'>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='user' />

          <div className='grid-1fr3fr py-2'>
            <span>
              <div className='lead'>
                <i className='fas fa-user'></i> Profile
              </div>
              <ProfileItem user={user} />
            </span>
            <span>
              {user.isEngineer ? (
                <>
                  <div className='lead'>
                    <i className='fas fa-screwdriver-wrench'></i> 我的R3
                  </div>
                  {r3s === null ? (
                    <Spinner />
                  ) : (
                    <ul className='table-grid-container '>
                      <li className='item item-container item-container-4b'>
                        <div className='attribute'></div>
                        {/* Enclose semantically similar attributes as a div hierarchy */}
                        <div className='attribute'>R3 No.</div>
                        <div className='attribute'>Date</div>
                        <div className='attribute'>Engineer</div>
                      </li>

                      {r3s &&
                        r3s.length > 0 &&
                        r3s.map((e) => (
                          <li
                            className='item item-container item-container-4b'
                            key={e._id}
                          >
                            <small className='attribute' data-name='Open'>
                              <Link to={`/r3s/${e._id}`}>
                                <i className='fas fa-eye'></i>
                              </Link>
                            </small>
                            <small className='attribute' data-name='R3 No.'>
                              {e.r3Number}
                            </small>
                            <small className='attribute' data-name='Date'>
                              {e.r3Date}
                            </small>
                            <div className='attribute' data-name='R3 Completed'>
                              {e.r3Completed && (
                                <i className='text-center fa-solid fa-circle-check text-success'></i>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </span>
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profile.propTypes = {
  getUserById: PropTypes.func.isRequired,
  getDepartmentsByUserId: PropTypes.func.isRequired,
  getR3s: PropTypes.func.isRequired,
  r3: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  user: state.user,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getUserById,
  getDepartmentsByUserId,
  getR3s,
})(Profile);
