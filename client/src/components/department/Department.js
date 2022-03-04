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
};

Department.propTypes = {
  getDepartment: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});

export default connect(mapStateToProps, { getDepartment })(Department);
