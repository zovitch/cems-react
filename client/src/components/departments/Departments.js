<<<<<<< HEAD
import React, { Fragment, useEffect } from 'react';
=======
import React, { useEffect } from 'react';
>>>>>>> a6388f7a246a8801ba360f96e42e8ae913782402
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getDepartments } from '../../actions/department';
<<<<<<< HEAD
import DepartmentItem from './DepartmentItem';

const Departments = ({
  getDepartments,
  department: { departments, loading },
}) => {
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);
  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Departments</h1>
          <div className='profiles'>
            {departments.length > 0 ? (
              departments.map((department) => (
                <DepartmentItem key={department._id} department={department} />
              ))
            ) : (
              <h4>No department found</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
=======

const Departments = ({ getDepartments, department }) => {
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);
  return <div>Departments</div>;
>>>>>>> a6388f7a246a8801ba360f96e42e8ae913782402
};

Departments.propTypes = {
  getDepartments: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});

export default connect(mapStateToProps, { getDepartments })(Departments);
