import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getDepartments } from '../../actions/department';

const Departments = ({ getDepartments, department }) => {
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);
  return <div>Departments</div>;
};

Departments.propTypes = {
  getDepartments: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});

export default connect(mapStateToProps, { getDepartments })(Departments);
