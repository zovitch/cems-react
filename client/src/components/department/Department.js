<<<<<<< HEAD
import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getDepartment } from '../../actions/department';
import Spinner from '../layout/Spinner';
import DepartmentTop from './DepartmentTop';

const Department = ({ getDepartment, department: { department, loading } }) => {
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

          <div className='my-1'>
            <DepartmentTop department={department} />
          </div>
        </Fragment>
      )}
    </section>
  );
=======
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDepartment } from '../../actions/department';

const Department = ({ getDepartment, department: { department, loading } }) => {
  const { trigram } = useParams();
  useEffect(() => {
    getDepartment(trigram);
  }, [getDepartment, trigram]);

  return <div>Department</div>;
>>>>>>> a6388f7a246a8801ba360f96e42e8ae913782402
};

Department.propTypes = {
  getDepartment: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});

export default connect(mapStateToProps, { getDepartment })(Department);
