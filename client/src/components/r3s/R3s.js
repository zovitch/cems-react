import React, { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getR3s } from '../../actions/r3';
import formatDate from '../../utils/formatDate';

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
            {' '}
            <Link to={`/r3s/`}>
              <i className='btn btn-dark fas fa-filter-circle-xmark'> </i>
              <span className='p-1-2'>Show All</span>
            </Link>
            <Link to={`/r3s/?applicantValidationDate=false`}>
              <i className='btn btn-dark fas fa-filter'> </i>
              <span className='p-1-2'>Show only Pending R3</span>
            </Link>
          </div>

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-18 '>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>R3 No.</div>
              <div className='attribute'>EQU No.</div>
              <div className='attribute'>EQU Name</div>
              <div className='attribute'></div>
              <div className='attribute'>Date</div>
              <div className='attribute'>Applicant</div>
              <div className='attribute'>Failure</div>
              <div className='attribute'>Explanation</div>
              <div className='attribute'>报修说明</div>
              <div className='attribute'>Status</div>
              <div className='attribute'>Engineer</div>
              <div className='attribute'>Repair</div>
              <div className='attribute'>Record</div>
              <div className='attribute'>修理情况</div>
              <div className='attribute'>Repair Date</div>
              <div className='attribute'>Validation</div>
            </li>

            {/* The rest of the items in the list are the actual data */}
            {r3s &&
              r3s.length > 0 &&
              r3s.map((r3) => (
                <li
                  key={r3._id}
                  className='item item-container item-container-18'
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
                  <div className='attribute' data-name='EQU Name'>
                    {r3.machine && r3.machine.designation}
                  </div>
                  <div className='attribute' data-name='EQU Name CN'>
                    {r3.machine && r3.machine.designationCN}
                  </div>
                  <div className='attribute' data-name='R3 Date'>
                    {r3.r3Date && formatDate(r3.r3Date)}
                  </div>
                  <div className='attribute' data-name='Applicant'>
                    {r3.applicant}
                  </div>
                  <div className='attribute' data-name='Failure Code'>
                    {r3.failureCode &&
                      String(r3.failureCode.codeNumber).padStart(2, '0') +
                        ' - ' +
                        r3.failureCode.name}
                  </div>
                  <div className='attribute' data-name='Explanation'>
                    {r3.failureExplanation}
                  </div>
                  <div className='attribute' data-name='报修说明'>
                    {r3.failureExplanationCN}
                  </div>
                  <div className='attribute' data-name='Machine Status'>
                    {r3.machineStopped && (
                      <i className='fas fa-stop-circle fa-center'></i>
                    )}
                  </div>
                  <div className='attribute' data-name='Repair Engineer'>
                    {r3.repairEngineer && r3.repairEngineer.name}
                  </div>
                  <div className='attribute' data-name='Repair Code'>
                    {r3.repairCode &&
                      String(r3.repairCode.codeNumber).padStart(2, '0') +
                        ' - ' +
                        r3.repairCode.name}
                  </div>
                  <div className='attribute' data-name='Repair Record'>
                    {r3.repairExplanation}
                  </div>
                  <div className='attribute' data-name='修理情况'>
                    {r3.repairExplanationCN}
                  </div>
                  <div className='attribute' data-name='Repair Date'>
                    {r3.engineeringRepairDate &&
                      formatDate(r3.engineeringRepairDate)}
                  </div>
                  <div
                    className='attribute'
                    data-name='Applicant Validation Date'
                  >
                    {r3.applicantValidationDate &&
                      formatDate(r3.applicantValidationDate)}
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
