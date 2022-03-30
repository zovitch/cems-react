import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createMachine,
  getMachine,
  deleteMachine,
} from '../../actions/machine';
import { getCategories } from '../../actions/category';
import { getDepartments } from '../../actions/department';
import Select from 'react-select';

const initialState = {
  machineNumber: '',
  qualityNumber: '',
  designationCN: '',
  designation: '',
  category: '',
  department: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  manufacturingDate: '',
  acquiredDate: '',
  investmentNumber: '',
  costCenter: '',
  retiredDate: '',
  purchasedPrice: '',
  comment: '',
  parentMachine: '',
  afa: '',
};

const MachineForm = ({
  machine: { machine },
  category: { categories },
  department: { departments },
  createMachine,
  getMachine,
  getCategories,
  getDepartments,
  deleteMachine,
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { machineId } = useParams();
  let creatingMachine = true;
  if (machineId) creatingMachine = false;

  useEffect(() => {
    !machine && machineId && getMachine(machineId);
    !categories.length > 0 && getCategories();
    !departments.length > 0 && getDepartments();

    if (machine && !machine.loading) {
      const machineData = { ...initialState };
      for (const key in machine) {
        if (key in machineData) machineData[key] = machine[key];
      }
      setFormData(machineData);
    }
  }, [
    categories,
    departments.length,
    getCategories,
    getDepartments,
    getMachine,
    machine,
    machineId,
  ]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createMachine(formData, navigate, creatingMachine, machineId);
  };

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
      <h2>
        EQU No. 8
        {/* {formData.department}
        {formData.department && formData.department.location
          ? formData.department.location.floor
          : '⎵'}
        {formData.acquiredDate ? formData.acquiredDate : '⎵⎵'} */}
        ⎵⎵⎵
      </h2>

      <form className='form py' onSubmit={onSubmit}>
        {/* Import from AFA */}

        <div className='form-group'>
          <small className='form-text'>EQU No.</small>
          <input
            type='text'
            placeholder='Equipment Number'
            name='machineNumber'
            value={formData.machineNumber}
            onChange={onChange}
            disabled
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>QUA No.</small>
          <input
            type='text'
            placeholder='Quality Number'
            name='qualityNumber'
            value={formData.qualityNumber}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>设备名称</small>
          <input
            type='text'
            placeholder='设备名称'
            name='designationCN'
            value={formData.designationCN}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Designation</small>
          <input
            type='text'
            placeholder='Designation'
            name='designation'
            value={formData.designation}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Category</small>
          {categories.length > 0 ? (
            <select
              name='category'
              value={formData.category && formData.category._id}
              id='category-select'
              onChange={onChange}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.code} - {category.trigram} - {category.description}
                </option>
              ))}
            </select>
          ) : (
            <h4>Loading Categories</h4>
          )}
        </div>

        {/* <div className='form-group'>
          <small className='form-text'>Category</small>
          {categories.length > 0 ? (
            <Select name='category' />
          ) : (
            <h4>Loading Categories</h4>
          )}
        </div> */}

        <div className='form-group'>
          <small className='form-text'>Department</small>
          {departments.length > 0 ? (
            <select
              name='department'
              value={formData.department && formData.department._id}
              id='department-select'
              onChange={onChange}
            >
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name} -{' '}
                  {department.location && department.location.floor}/F
                </option>
              ))}
            </select>
          ) : (
            <h4>Loading Departments</h4>
          )}
        </div>
        {/* manufacturer */}

        <div className='form-group'>
          <small className='form-text'>Model</small>
          <input
            type='text'
            placeholder='Model'
            name='model'
            value={formData.model}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Serial Number</small>
          <input
            type='text'
            placeholder='Serial Number'
            name='serialNumber'
            value={formData.serialNumber}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Manufacturing Date</small>
          <input
            type='date'
            placeholder='Manufacturing Date'
            name='manufacturingDate'
            value={formData.manufacturingDate}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Acquired Date</small>
          <input
            type='date'
            placeholder='Acquired Date'
            name='acquiredDate'
            value={formData.acquiredDate}
            onChange={onChange}
          />
        </div>

        {/* Investment Number */}

        <div className='form-group'>
          <small className='form-text'>Cost Center</small>
          <input
            type='text'
            placeholder='Cost Center'
            name='costCenter'
            value={formData.costCenter}
            onChange={onChange}
          />
        </div>

        {/* Retired Date */}

        <div className='form-group'>
          <small className='form-text'>Purchased Price</small>
          <input
            type='text'
            placeholder='Purchased Price'
            name='purchasedPrice'
            value={formData.purchasedPrice}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Comment</small>
          <input
            type='text'
            placeholder='Comment'
            name='comment'
            value={formData.comment}
            onChange={onChange}
          />
        </div>
        {/* Parent Machine */}
        {/* Machine Picture  */}

        <input
          type='submit'
          value={` ${machine && machine.loading ? 'Wait' : 'Save'}`}
          className={`btn ${
            machine && machine.loading ? 'btn-light' : 'btn-primary'
          } my-1`}
          disabled={machine && machine.loading ? true : false}
        />
        <Link className='btn btn-light my-1' to='/machines'>
          Go Back
        </Link>
      </form>
      {creatingMachine === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteMachine(machineId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Machine
            </button>
          </div>
        </>
      )}
    </section>
  );
};

MachineForm.propTypes = {
  machine: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  department: PropTypes.object.isRequired,
  createMachine: PropTypes.func.isRequired,
  getMachine: PropTypes.func.isRequired,
  deleteMachine: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  machine: state.machine,
  category: state.category,
  department: state.department,
});

export default connect(mapStateToProps, {
  createMachine,
  getMachine,
  deleteMachine,
  getCategories,
  getDepartments,
})(MachineForm);
