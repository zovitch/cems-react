import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDepartment } from '../../actions/department';
import Spinner from '../layout/Spinner';
import DepartmentItem from '../departments/DepartmentItem';
import PageTitleBarSingleViewAdmin from '../layout/PageTitleBarSingleViewAdmin';

const Department = ({ getDepartment, department: { department }, auth }) => {
  const { departmentId } = useParams();

  useEffect(() => {
    getDepartment(departmentId);
  }, [getDepartment, departmentId]);

  return (
    <section className='container'>
      {department === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleViewAdmin item='department' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-briefcase'></i> Department
              </div>
              <DepartmentItem department={department} />
            </div>
            {/* <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-clipboard-list'></i> Show some machine here
                @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div> */}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Department.propTypes = {
  getDepartment: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
  auth: state.auth,
});

export default connect(mapStateToProps, { getDepartment })(Department);
