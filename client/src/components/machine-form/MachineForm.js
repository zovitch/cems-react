import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getMachine,
  createMachine,
  deleteMachine,
  getNewMachineNumber,
} from '../../actions/machine';
import { getCategories } from '../../actions/category';
import { getDepartments } from '../../actions/department';
import { getManufacturers } from '../../actions/manufacturer';
import { getInvestments } from '../../actions/investment';
import Select from 'react-select';
import nth from '../../utils/nth';
import formatDate from '../../utils/formatDate';
import ToggleSwitch from '../layout/ToggleSwitch';

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
  investment: '',
  costCenter: '',
  retiredDate: '',
  purchasedPrice: '',
  comment: '',
  parentMachine: '',
  afa: '',
};

// Styling for <Select />
// const customStyles = {
//   option: (provided, state) => ({
//     ...provided,
//     borderBottom: '1px dotted pink',
//     color: state.isSelected ? 'red' : 'blue',
//     padding: 20,
//   }),
//   control: () => ({
//     // none of react-select's styles are passed to <Control />
//     width: 200,
//   }),
//   singleValue: (provided, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return { ...provided, opacity, transition };
//   },
// };

const MachineForm = ({
  machine: { machine, newMachineNumber },
  category: { categories },
  department: { departments },
  manufacturer: { manufacturers },
  investment: { investments },
  createMachine,
  getMachine,
  getCategories,
  getNewMachineNumber,
  getDepartments,
  getManufacturers,
  getInvestments,
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
    !manufacturers.length > 0 && getManufacturers();
    !investments.length > 0 && getInvestments();
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
    getNewMachineNumber,
    getMachine,
    machine,
    machineId,
    manufacturers.length,
    getManufacturers,
    investments.length,
    getInvestments,
  ]);

  // if we create a Machine (creatingMachine: true) then the toogle should be OFF (false)
  // if we edit a Machine (creatingMachine: false) then toggle should be ON (true)
  const [toggleCheckboxOn, setToggleCheckboxOn] = useState(!creatingMachine);

  const defaultCategory = !formData.category
    ? ''
    : {
        value: formData.category._id,
        label:
          formData.category.code +
          ' - ' +
          formData.category.trigram +
          ' - ' +
          formData.category.description,
      };

  const defaultManufacturer = !formData.manufacturer
    ? ''
    : {
        value: formData.manufacturer._id,
        label:
          formData.manufacturer.name + ' - ' + formData.manufacturer.nameCN,
      };

  const defaultInvestment = !formData.investment
    ? ''
    : {
        value: formData.investment._id,
        label:
          formData.investment.investmentNumber +
          ' - ' +
          formData.investment.name,
      };

  const defaultDepartment =
    formData.department &&
    formData.department.location &&
    formData.department.location.floor
      ? {
          value: formData.department._id,
          label:
            formData.department.name +
            ' - ' +
            nth(formData.department.location.floor) +
            ' floor',
        }
      : '';

  // Hangle toggle for the checkbox ToggleSwitch Component
  const onToggle = (e) => {
    setToggleCheckboxOn(!toggleCheckboxOn);
  };

  // On Change handlers
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    formData.department && getNewMachineNumber(formData);
  };

  const onChangeCategory = (e) => {
    const newValues = { ...formData };
    newValues.category = {
      _id: e.value,
      code: e.label.split(' - ', 3)[0],
      trigram: e.label.split(' - ', 3)[1],
      description: e.label.split(' - ', 3)[2],
    };
    setFormData(newValues);
  };

  const onChangeManufacturer = (e) => {
    const newValues = { ...formData };
    newValues.manufacturer = {
      _id: e.value,
      name: e.label.split(' - ', 2)[0],
      nameCN: e.label.split(' - ', 2)[1],
    };
    setFormData(newValues);
  };

  const onChangeInvestment = (e) => {
    const newValues = { ...formData };
    newValues.investment = {
      _id: e.value,
      investmentNumber: e.label.split(' - ', 2)[0],
      name: e.label.split(' - ', 2)[1],
    };
    setFormData(newValues);
  };

  const onChangeDepartment = (e) => {
    const newValues = { ...formData };
    newValues.department = {
      _id: e.value,
      name: e.label.split(' - ', 2)[0],
      location: {
        floor: e.label.split(' - ', 2)[1][0], // this work only if floor is one digit
      },
    };
    setFormData(newValues);
    getNewMachineNumber(newValues);
  };

  const onChangeAcquiredDate = (e) => {
    const newValues = { ...formData };
    newValues.acquiredDate = e.target.value;
    setFormData(newValues);
    formData.department && getNewMachineNumber(newValues);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newValues = { ...formData };
    newValues.machineNumber = newMachineNumber;
    setFormData(newValues);

    document.querySelector('#machineNumberToggle') &&
    document.querySelector('#machineNumberToggle').checked
      ? createMachine(formData, navigate, creatingMachine, machineId)
      : createMachine(newValues, navigate, creatingMachine, machineId);
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
            <i className='fas fa-edit'></i> Edit an Equipment
          </div>
        )}
      </h1>

      <form className='form py' onSubmit={onSubmit}>
        {/* Import from AFA */}

        <div className='form-group'>
          <div className='lockField'>
            <span></span>
            <small className='form-text'>
              {document.querySelector('#machineNumberToggle') &&
              document.querySelector('#machineNumberToggle').checked
                ? ' EQU No.'
                : 'Automatically generated EQU No.'}
            </small>
          </div>
          <div className='lockField'>
            <ToggleSwitch
              name='machineNumberToggle'
              id='machineNumberToggle'
              defaultChecked={toggleCheckboxOn}
              onClick={onToggle}
              onChange={onChange}
            />

            <input
              type='text'
              placeholder={
                document.querySelector('#machineNumberToggle') &&
                document.querySelector('#machineNumberToggle').checked
                  ? 'Enter an Equipment Number'
                  : 'Select a Department to generate an EQU No.'
              }
              name='machineNumber'
              value={
                document.querySelector('#machineNumberToggle') &&
                document.querySelector('#machineNumberToggle').checked
                  ? formData.machineNumber
                  : newMachineNumber
                  ? newMachineNumber
                  : ''
              }
              onChange={onChange}
              readOnly={!toggleCheckboxOn}
              // autoFocus
            />
          </div>
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
          {categories.length > 0 && (
            <Select
              // styles={customStyles}
              name='category'
              placeholder='Select a Category'
              defaultValue={defaultCategory}
              key={formData.category && formData.category._id}
              onChange={onChangeCategory}
              options={categories.map((e) => ({
                value: e._id,
                label: e.code + ' - ' + e.trigram + ' - ' + e.description,
              }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

        <div className='form-group'>
          <small className='form-text'>Department</small>
          {departments.length > 0 && (
            <Select
              name='department'
              placeholder='Select a Department'
              defaultValue={defaultDepartment}
              key={formData.department && formData.department._id}
              onChange={onChangeDepartment}
              options={departments.map((e) => ({
                value: e._id,
                label: e.name + ' - ' + nth(e.location.floor) + ' floor',
              }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

        <div className='form-group'>
          <small className='form-text'>Manufacturer</small>
          {manufacturers.length > 0 && (
            <Select
              name='manufacturer'
              placeholder='Select a Manufacturer'
              defaultValue={defaultManufacturer}
              key={formData.manufacturer && formData.manufacturer._id}
              onChange={onChangeManufacturer}
              options={manufacturers.map((e) => ({
                value: e._id,
                label: e.name + ' - ' + e.nameCN,
              }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

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
            value={
              formData.manufacturingDate &&
              formatDate(formData.manufacturingDate)
            }
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Acquired Date</small>
          <input
            type='date'
            placeholder='Acquired Date'
            name='acquiredDate'
            value={formData.acquiredDate && formatDate(formData.acquiredDate)}
            onChange={onChangeAcquiredDate}
            // onBlur={onBlur}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Investment No.</small>
          {investments.length > 0 && (
            <Select
              name='investment'
              placeholder='Select an Investment No.'
              defaultValue={defaultInvestment}
              key={formData.investment && formData.investment._id}
              onChange={onChangeInvestment}
              options={investments.map((e) => ({
                value: e._id,
                label: e.investmentNumber + ' - ' + e.name,
              }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

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
  manufacturer: PropTypes.object.isRequired,
  investment: PropTypes.object.isRequired,
  createMachine: PropTypes.func.isRequired,
  getMachine: PropTypes.func.isRequired,
  getNewMachineNumber: PropTypes.func.isRequired,
  deleteMachine: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  getManufacturers: PropTypes.func.isRequired,
  getInvestments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  machine: state.machine,
  category: state.category,
  department: state.department,
  manufacturer: state.manufacturer,
  investment: state.investment,
});

export default connect(mapStateToProps, {
  createMachine,
  getMachine,
  getNewMachineNumber,
  deleteMachine,
  getCategories,
  getDepartments,
  getManufacturers,
  getInvestments,
})(MachineForm);
