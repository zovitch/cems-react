import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getR3s } from '../../actions/r3';
import R3Edit from '../r3-form/R3Edit';

const R3s = ({ getR3s, auth, r3: { r3s, loading } }) => {
  const r3Query = useLocation();

  const [r3Display, setR3Display] = useState();

  useEffect(() => {
    getR3s(r3Query.search);
  }, [getR3s, r3Query.search]);

  const handleOnclick = (e) => {
    setR3Display(e);
  };

  return (
    <section className='container-large'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar item='r3' faIcon='fas fa-screwdriver-wrench' />

          <div>
            <Link to={`/r3s/`}>
              <i className='btn btn-dark fas fa-filter-circle-xmark'> </i>
              <span className='p-1-2'>Show All</span>
            </Link>
            <Link to={`/r3s/?applicantValidationDate=false`}>
              <i className='btn btn-dark fas fa-filter'> </i>
              <span className='p-1-2'>Show only Pending R3</span>
            </Link>
          </div>

          <div className='viewPageSplit2'>
            <ul className='table-grid-container my-2 view-left'>
              {/* The first list item is the header of the table  */}
              <li className='item item-container item-container-left-4 '>
                {/* Enclose semantically similar attributes as a div hierarchy */}
                <div className='attribute'>R3 No.</div>
                <div className='attribute'>EQU</div>
                <div className='attribute'>设备名称</div>
                <div className='attribute'>Resp.</div>
              </li>

              {/* The rest of the items in the list are the actual data */}
              {r3s &&
                r3s.length > 0 &&
                r3s.map((r3) => (
                  <li
                    key={r3._id}
                    className='item item-container item-container-left-4 pointerHover'
                    onClick={() => handleOnclick(r3)}
                  >
                    <div className='attribute ' data-name='R3 No.'>
                      {r3.r3Number}
                    </div>
                    <div className='attribute' data-name='EQU Name'>
                      {r3.machine && r3.machine.designation}
                    </div>
                    <div className='attribute' data-name='设备名称'>
                      {r3.machine && r3.machine.designationCN}
                    </div>
                    <div className='attribute' data-name='Repair Engineer'>
                      {r3.repairEngineer && r3.repairEngineer.name}
                    </div>
                  </li>
                ))}
            </ul>
            <div className='view-right'>
              {r3Display ? (
                <R3Edit r3Display={r3Display} />
              ) : (
                <h2>Please select an R3 on the left side</h2>
              )}
            </div>
          </div>
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
