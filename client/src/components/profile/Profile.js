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
import formatDate from '../../utils/formatDate';
import Avatar from 'react-avatar';

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
    getR3s(`?requester=${id}`);
  }, [getR3s, id]);

  return (
    <section className='container'>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='user' />

          <div className='viewPageSplit1 py-2'>
            <span>
              <div className='lead'>
                <i className='fas fa-user'></i> Profile
              </div>
              <ProfileItem user={user} />
            </span>
            <span>
              <>
                <div className='lead'>
                  <i className='fas fa-screwdriver-wrench'></i> 我的R3
                </div>
                {r3s === null ? (
                  <Spinner />
                ) : (
                  <ul className='table-grid-container '>
                    <li className='item item-container item-container-r3 '>
                      <div className='attribute'></div>
                      <div className='attribute'></div>
                      {/* Enclose semantically similar attributes as a div hierarchy */}
                      <div className='attribute'>R3 No.</div>
                      <div className='attribute'>EQU No.</div>
                      <div className='attribute'>设备名称</div>
                      <div className='attribute'>EQU Name</div>
                      <div className='attribute'>Date</div>
                      <div className='attribute'>Applicant</div>
                      <div className='attribute'>Eng</div>
                    </li>
                    {/* The rest of the items in the list are the actual data */}
                    {r3s &&
                      r3s.length > 0 &&
                      r3s.map((r3) => (
                        <li
                          key={r3._id}
                          className='item item-container item-container-r3'
                        >
                          <div className='attribute ' data-name='Open'>
                            <Link to={`/r3s/${r3._id}`}>
                              <i className='fas fa-eye'></i>
                            </Link>
                          </div>
                          <div className='attribute' data-name='Edit'>
                            {auth && auth.isAuthenticated && (
                              <Link to={`/r3s/edit/${r3._id}`}>
                                <i className='fas fa-edit'></i>
                              </Link>
                            )}
                          </div>

                          <div className='attribute' data-name='R3 No.'>
                            <small>
                              {r3.r3Number}{' '}
                              {r3.r3Completed ? (
                                <i className='fa-solid fa-xs fa-circle-check text-success'></i>
                              ) : (
                                <i className='fa-solid fa-xs fa-circle-xmark text-danger'></i>
                              )}
                            </small>
                          </div>
                          <div
                            className='attribute hide-sm'
                            data-name='EQU No.'
                          >
                            {r3.machine && r3.machine.machineNumber}
                          </div>
                          <div className='attribute' data-name='设备名称'>
                            {r3.machine && r3.machine.designationCN}
                          </div>
                          <div
                            className='attribute hide-sm'
                            data-name='EQU Name'
                          >
                            {r3.machine && r3.machine.designation}
                          </div>
                          <div
                            className='attribute hide-sm'
                            data-name='R3 Date'
                          >
                            {r3.r3Date && formatDate(r3.r3Date)}
                          </div>
                          <div
                            className='attribute hide-sm'
                            data-name='Applicant'
                          >
                            {r3.requester && (
                              <Avatar
                                name={r3.requester.name}
                                round={true}
                                size='22px'
                              />
                            )}{' '}
                            <span className='hide-sm'>{r3.applicant}</span>
                          </div>
                          <div
                            className='attribute'
                            data-name='Repair Engineer'
                          >
                            {r3.repairEngineer && (
                              <Avatar
                                name={r3.repairEngineer.name}
                                round={true}
                                size='22px'
                              />
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </>
              <br />
              <hr />
              <br />
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
