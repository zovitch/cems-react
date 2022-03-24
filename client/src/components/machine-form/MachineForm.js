import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const initialState = {
  machineNumber: null,
  qualityNumber: null,
  designation: null,
  designationCN: null,
  category: null,
  department: null,
  manufacturer: null,
  model: null,
  serialNumber: null,
  manufacturingDate: null,
  acquiredDate: null,
  investmentNumber: null,
  costCenter: null,
  retiredDate: null,
  purchasedPrice: null,
  comment: null,
  parentMachine: null,
  afa: null,
  loading: true,
  error: {},
};

const MachineForm = ({ machine: { machines } }) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { machineId } = useParams();
  let creatingMachine = true;
  if (machineId) creatingMachine = false;

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        {creatingMachine ? (
          <div>
            <i className='fas fa-file-circle-plus'> </i> Add a new Equipment
          </div>
        ) : (
          <div>
            <i className='fas fa-edit'></i> Edit an Equipment{' '}
          </div>
        )}
      </h1>
    </section>
  );
};

MachineForm.propTypes = {
  machine: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  machine: state.machine,
});

export default connect(mapStateToProps, null)(MachineForm);
