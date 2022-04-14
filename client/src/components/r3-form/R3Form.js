import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getR3, createR3, deleteR3 } from '../../actions/r3';
import { getMachines } from '../../actions/machine';
import { getCodes } from '../../actions/code';

import Select from 'react-select';
import formatDate from '../../utils/formatDate';
import ToggleSwitch from '../layout/ToggleSwitch';

const initialState = {
  r3Number: '',
  machine: '',
  r3Date: '',
  applicant: '',
  failureCode: '',
  failureExplanation: '',
  failureExplanationCN: '',
  machineStopped: false,
  repairEngineer: '',
  repairCode: '',
  repairExplanation: '',
  repairExplanationCN: '',
  engineeringRemark: '',
  analysisCode: '',
  analysisExplanation: '',
  analysisExplanationCN: '',
  maintenanceOilWaste: false,
  maintenancePlasticAndMetalWaste: false,
  maintenanceSpareParts: false,
  repairDate: '',
  applicantValidation: '',
  remark: '',
};

let optionFailureCodes = [];
let optionsRepairCodes = [];
let optionsAnalysisCodes = [];

const R3Form = ({
  r3: { r3 },
  machine: { machines },
  code: { codes },
  createR3,
  getR3,
  getMachines,
  getCodes,
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { r3Id } = useParams();
  let creatingR3 = true;
  if (r3Id) creatingR3 = false;

  // if we create a R3 (creatingR3: true) then the toogle should be OFF (false)
  // if we edit a R3 (creatingR3: false) then toggle should be ON (true)
  const [toggleR3NumberOn, setToggleR3NumberOn] = useState(!creatingR3);
  const [toggleMachineStoppedOn, setToggleMachineStoppedOn] = useState();
  const [toggleOilWasteOn, setToggleOilWasteOn] = useState();
  const [togglePlasticAndMetalWasteOn, setTogglePlasticAndMetalWasteOn] =
    useState();
  const [toggleSpareParts, setToggleSpareParts] = useState();

  useEffect(() => {
    !r3 && r3Id && getR3(r3Id);

    !machines.length > 0 && getMachines();

    if (!optionFailureCodes.length > 0) {
      getCodes('failure');
      optionFailureCodes = codes.map((e) => ({
        value: e._id,
        label:
          e.codeNumber +
          ' - ' +
          e.name +
          ' - ' +
          e.descriptionCN +
          ' - ' +
          e.description,
      }));
    }

    if (!optionsRepairCodes.length > 0) {
      getCodes('repair');
      optionsRepairCodes = codes.map((e) => ({
        value: e._id,
        label:
          e.codeNumber +
          ' - ' +
          e.name +
          ' - ' +
          e.descriptionCN +
          ' - ' +
          e.description,
      }));
    }

    if (!optionsAnalysisCodes.length > 0) {
      getCodes('analysis');
      optionsAnalysisCodes = codes.map((e) => ({
        value: e._id,
        label:
          e.codeNumber +
          ' - ' +
          e.name +
          ' - ' +
          e.descriptionCN +
          ' - ' +
          e.description,
      }));
    }

    if (r3 && !r3.loading) {
      const r3Data = { ...initialState };
      for (const key in r3) {
        if (key in r3Data) r3Data[key] = r3[key];
      }
      setFormData(r3Data);
      setToggleMachineStoppedOn(!r3Data.machineStopped);
      setToggleOilWasteOn(r3Data.maintenanceOilWaste);
      setTogglePlasticAndMetalWasteOn(r3Data.maintenancePlasticAndMetalWaste);
      setToggleSpareParts(r3Data.maintenanceSpareParts);
    }
  }, [
    codes,
    codes.length,
    getCodes,
    getMachines,
    getR3,
    machines.length,
    r3,
    r3Id,
  ]);

  const defaultMachine = !formData.machine
    ? ''
    : {
        value: formData.machine._id,
        label:
          formData.machine.machineNumber +
          ' - ' +
          formData.machine.designationCN +
          ' - ' +
          formData.machine.designation,
      };

  const defaultFailureCode = !formData.failureCode
    ? ''
    : {
        value: formData.failureCode._id,
        label:
          formData.failureCode.codeNumber +
          ' - ' +
          formData.failureCode.name +
          ' - ' +
          formData.failureCode.descriptionCN +
          ' - ' +
          formData.failureCode.description,
      };

  const onChangeMachine = (e) => {
    const newValues = { ...formData };
    newValues.machine = {
      _id: e.value,
      machineNumber: e.label.split(' - ', 3)[0],
      designationCN: e.label.split(' - ', 3)[1],
      designation: e.label.split(' - ', 3)[2],
    };
    setFormData(newValues);
  };

  const onChangeFailureCode = (e) => {
    const newValues = { ...formData };
    newValues.failureCode = {
      _id: e.value,
      codeNumber: e.label.split(' - ', 4)[0],
      name: e.label.split(' - ', 4)[1],
      descriptionCN: e.label.split(' - ', 4)[2],
      description: e.label.split(' - ', 4)[3],
    };
    setFormData(newValues);
  };

  // Hangle toggle for the checkbox ToggleSwitch Component
  const onToggleR3Number = (e) => {
    setToggleR3NumberOn(!toggleR3NumberOn);
  };

  const onChange = (e) => {
    e.target.type === 'checkbox' &&
      (e.target.value = Boolean(e.target.checked));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createR3(formData, navigate, creatingR3, r3Id);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        {creatingR3 ? (
          <div>
            <i className='fas fa-screwdriver'> </i> Create a new R3 Application
          </div>
        ) : (
          <div>
            <i className='fas fa-edit'></i> Edit a R3 Application
          </div>
        )}
      </h1>

      <form className='form py' onSubmit={onSubmit}>
        {/* Import from AFA */}

        <div className='form-group'>
          <div className='lockField'>
            <span></span>
            <small className='form-text'>
              {document.querySelector('#r3NumberToggle') &&
              document.querySelector('#r3NumberToggle').checked
                ? 'R3 No.'
                : 'Automatically generated R3 No.'}
            </small>
          </div>
          <div className='lockField'>
            <ToggleSwitch
              name='r3NumberToggle'
              id='r3NumberToggle'
              defaultChecked={toggleR3NumberOn}
              onClick={onToggleR3Number}
              // onChange={onChange}
            />

            <input
              type='text'
              placeholder={
                document.querySelector('#r3NumberToggle') &&
                document.querySelector('#r3NumberToggle').checked
                  ? 'Enter a R3 Number'
                  : 'Select an EQU No. to generate an R3 No.'
              }
              name='r3Numbers'
              id='r3Numbers'
              value={formData.r3Number}
              onChange={onChange}
              readOnly={!toggleR3NumberOn}
            />
          </div>
        </div>

        <div className='form-group'>
          <small className='form-text'>Date</small>
          <input
            type='date'
            placeholder='R3 Date'
            name='r3Date'
            id='r3Date'
            value={formData.r3Date && formatDate(formData.r3Date)}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Comment</small>
          <input
            type='text'
            placeholder='GD...'
            name='comment'
            id='comment'
            value={formData.comment}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>EQU No.</small>
          {machines.length > 0 && (
            <Select
              name='machines'
              id='machines'
              placeholder='Select a Machine'
              defaultValue={defaultMachine}
              key={formData.machine && formData.machine._id}
              onChange={onChangeMachine}
              options={machines.map((e) => ({
                value: e._id,
                label:
                  e.machineNumber +
                  ' - ' +
                  e.designationCN +
                  ' - ' +
                  e.designation,
              }))}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

        <div className='form-group'>
          <small className='form-text'>Applicant</small>
          <input
            type='text'
            placeholder='Name of the Applicant'
            name='applicant'
            id='applicant'
            value={formData.applicant}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Failure Code</small>
          {codes.length > 0 && (
            <Select
              name='failureCode'
              id='failureCode'
              placeholder='Select a Failure Code'
              defaultValue={defaultFailureCode}
              key={formData.failureCode && formData.failureCode._id}
              onChange={onChangeFailureCode}
              options={optionFailureCodes}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>
        <div className='form-group'>
          <textarea
            type='textarea'
            rows='4'
            placeholder='Describe the problem'
            name='failureExplanation'
            id='failureExplanation'
            value={formData.failureExplanation}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <textarea
            rows='4'
            placeholder='报修说明'
            name='failureExplanationCN'
            id='failureExplanationCN'
            value={formData.failureExplanationCN}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>
            {document.querySelector('#stoppedToggle') &&
            !document.querySelector('#stoppedToggle').checked
              ? 'Machine is stopped'
              : 'Machine is still running'}
          </small>
          <ToggleSwitch
            name='stoppedToggle'
            id='stoppedToggle'
            defaultChecked={toggleMachineStoppedOn}
            onClick={onChange}
          />
        </div>
        <input
          type='submit'
          id='submit'
          value={` ${r3 && r3.loading ? 'Wait' : 'Save'}`}
          className={`btn ${
            r3 && r3.loading ? 'btn-light' : 'btn-primary'
          } my-1`}
          disabled={r3 && r3.loading ? true : false}
        />

        <Link className='btn btn-light my-1' to='/r3s'>
          Go Back
        </Link>
      </form>
      {creatingR3 === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteR3(r3, navigate)}
            >
              <i className='fas fa-trash' /> Delete the R3
            </button>
          </div>
        </>
      )}
    </section>
  );
};

R3Form.propTypes = {
  r3: PropTypes.object.isRequired,
  machine: PropTypes.object.isRequired,
  code: PropTypes.object.isRequired,
  createR3: PropTypes.func.isRequired,
  getR3: PropTypes.func.isRequired,
  getMachines: PropTypes.func.isRequired,
  getCodes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  machine: state.machine,
  code: state.code,
});

export default connect(mapStateToProps, {
  createR3,
  getR3,
  deleteR3,
  getMachines,
  getCodes,
})(R3Form);
