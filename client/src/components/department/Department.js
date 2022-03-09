import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getDepartment } from '../../actions/department';
import Spinner from '../layout/Spinner';
import DepartmentItem from '../departments/DepartmentItem';

const Department = ({ getDepartment, department: { department }, auth }) => {
  const { id } = useParams();
  useEffect(() => {
    getDepartment(id);
  }, [getDepartment, id]);

  return (
    <section className='container'>
      {department === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/departments' className='btn btn-light'>
            Back to Departments
          </Link>
          {auth.isAuthenticated && auth.loading === false && (
            <Link to='/edit-department' className='btn btn-dark'>
              Edit Department
            </Link>
          )}
          <div className='my-1 bg-light'>
            <DepartmentItem department={department} />
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
