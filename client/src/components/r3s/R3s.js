import React, { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getR3s } from '../../actions/r3';
import formatDate from '../../utils/formatDate';
import Avatar from 'react-avatar';

const R3s = ({ getR3s, auth, r3: { r3s, loading } }) => {
  const r3Query = useLocation();

  useEffect(() => {
    getR3s(r3Query.search);
  }, [getR3s, r3Query.search]);

  return (
    <section className='container-large'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar item='r3' faIcon='fas fa-screwdriver-wrench' />

          <div>
            <Link to={`/r3s/`}>
              {/* Show all */}
              <i className='btn btn-dark fas fa-filter-circle-xmark'> 所有</i>
            </Link>
            <Link to={`/r3s/?r3Completed=false`}>
              {/* Show only pending R3 */}
              <i className='btn btn-dark fas fa-filter'> 未完成</i>
            </Link>
            {auth.user && auth.user.isEngineer && (
              <Link to={`/r3s/?repairEngineer=${auth.user._id}`}>
                {/* Only My R3 */}
                <i className='btn btn-dark fas fa-user-check'> 我的R3</i>
              </Link>
            )}
          </div>

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-10 '>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>R3 No.</div>
              <div className='attribute'>EQU No.</div>
              <div className='attribute'>设备名称</div>
              <div className='attribute'>EQU Name</div>
              <div className='attribute'>Date</div>
              <div className='attribute'>Applicant</div>
              <div className='attribute'>Engineer</div>
              <div className='attribute'>Done</div>
            </li>

            {/* The rest of the items in the list are the actual data */}
            {r3s &&
              r3s.length > 0 &&
              r3s.map((r3) => (
                <li
                  key={r3._id}
                  className='item item-container item-container-10'
                >
                  <div className='attribute' data-name='Open'>
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
                    {r3.r3Number}
                  </div>
                  <div className='attribute' data-name='EQU No.'>
                    {r3.machine && r3.machine.machineNumber}
                  </div>
                  <div className='attribute' data-name='设备名称'>
                    {r3.machine && r3.machine.designationCN}
                  </div>
                  <div className='attribute' data-name='EQU Name'>
                    {r3.machine && r3.machine.designation}
                  </div>
                  <div className='attribute' data-name='R3 Date'>
                    {r3.r3Date && formatDate(r3.r3Date)}
                  </div>
                  <div className='attribute' data-name='Applicant'>
                    {r3.applicant}
                  </div>
                  <div className='attribute' data-name='Repair Engineer'>
                    {r3.repairEngineer && (
                      <Avatar
                        className='badge'
                        name={r3.repairEngineer.name}
                        round={true}
                        size='25px'
                      />
                    )}
                  </div>
                  <div className='attribute' data-name='R3 Completed'>
                    {r3.r3Completed && (
                      <i className='text-center fa-solid fa-circle-check text-success'></i>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </section>
  );
};

R3s.propTypes = {
  getR3s: PropTypes.func.isRequired,
  r3: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  auth: state.auth,
});

export default connect(mapStateToProps, { getR3s })(R3s);
