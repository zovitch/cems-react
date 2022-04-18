import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getR3, createR3, deleteR3, getNewR3Number } from '../../actions/r3';
import { getMachines } from '../../actions/machine';
import { getCodes } from '../../actions/code';
import { getUsers } from '../../actions/user';

import Select from 'react-select';
import formatDate from '../../utils/formatDate';
import ToggleSwitch from '../layout/ToggleSwitch';

const initialState = {
  r3Number: '',
  machine: '',
  r3Date: formatDate(new Date()),
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

const R3Form = ({
  r3: { r3, newR3Number },
  machine: { machines },
  user: { users },
  failureCode,
  repairCode,
  analysisCode,
  createR3,
  getR3,
  getNewR3Number,
  getMachines,
  getUsers,
  getCodes,
  deleteR3,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [setToggleMachineStoppedOn, setTogglemachineStoppedOn] = useState();
  const navigate = useNavigate();
  const { r3Id } = useParams();
  let creatingR3 = true;
  if (r3Id) creatingR3 = false;

  // if we create a R3 (creatingR3: true) then the toogle should be OFF (false)
  // if we edit a R3 (creatingR3: false) then toggle should be ON (true)
  const [toggleR3NumberOn, setToggleR3NumberOn] = useState(!creatingR3);

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
  const defaultRepairCode = !formData.repairCode
    ? ''
    : {
        value: formData.repairCode._id,
        label:
          formData.repairCode.codeNumber +
          ' - ' +
          formData.repairCode.name +
          ' - ' +
          formData.repairCode.descriptionCN +
          ' - ' +
          formData.repairCode.description,
      };
  const defaultAnalysisCode = !formData.analysisCode
    ? ''
    : {
        value: formData.analysisCode._id,
        label:
          formData.analysisCode.codeNumber +
          ' - ' +
          formData.analysisCode.name +
          ' - ' +
          formData.analysisCode.descriptionCN +
          ' - ' +
          formData.analysisCode.description,
      };

  const defaultRepairEngineer = !formData.repairEngineer
    ? ''
    : {
        value: formData.repairEngineer._id,
        label: formData.repairEngineer.name,
      };

  const optionFailureCodes = failureCode.codes.map((e) => ({
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
  const optionRepairCodes = repairCode.codes.map((e) => ({
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
  const optionAnalysisCodes = analysisCode.codes.map((e) => ({
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

  const optionRepairEngineer = users.map((e) => ({
    value: e._id,
    label: e.name,
  }));

  useEffect(() => {
    !r3 && r3Id && getR3(r3Id);
    !machines.length > 0 && getMachines();
    !failureCode.codes.length > 0 && getCodes('failure');
    !repairCode.codes.length > 0 && getCodes('repair');
    !analysisCode.codes.length > 0 && getCodes('analysis');
    !users.length > 0 && getUsers();

    if (r3 && !r3.loading) {
      const r3Data = { ...initialState };
      for (const key in r3) {
        if (key in r3Data) r3Data[key] = r3[key];
      }
      setFormData(r3Data);
      setTogglemachineStoppedOn(r3Data.machineStopped);
    }
  }, [
    failureCode.codes.length,
    repairCode.codes.length,
    analysisCode.codes.length,
    getCodes,
    getMachines,
    getR3,
    getUsers,
    machines.length,
    r3,
    r3Id,
    users.length,
  ]);

  // Hangle toggle for the checkbox ToggleSwitch Component
  const onToggleR3Number = (e) => {
    setToggleR3NumberOn(!toggleR3NumberOn);
    getNewR3Number(formData);
  };

  // On Change handlers
  const onChange = (e) => {
    e.target.type === 'checkbox' &&
      (e.target.value = Boolean(e.target.checked));
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    getNewR3Number(newValues);
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
  const onChangeRepairCode = (e) => {
    const newValues = { ...formData };
    newValues.repairCode = {
      _id: e.value,
      codeNumber: e.label.split(' - ', 4)[0],
      name: e.label.split(' - ', 4)[1],
      descriptionCN: e.label.split(' - ', 4)[2],
      description: e.label.split(' - ', 4)[3],
    };
    setFormData(newValues);
  };
  const onChangeAnalysisCode = (e) => {
    const newValues = { ...formData };
    newValues.analysisCode = {
      _id: e.value,
      codeNumber: e.label.split(' - ', 4)[0],
      name: e.label.split(' - ', 4)[1],
      descriptionCN: e.label.split(' - ', 4)[2],
      description: e.label.split(' - ', 4)[3],
    };
    setFormData(newValues);
  };

  const onChangeR3Date = (e) => {
    const newValues = { ...formData };
    newValues.r3Date = e.target.value;
    setFormData(newValues);
    newValues.machine && getNewR3Number(newValues);
  };

  const onChangeRepairEngineer = (e) => {
    const newValues = { ...formData };
    newValues.repairEngineer = {
      _id: e.value,
      name: e.label,
    };
    setFormData(newValues);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newValues = { ...formData };
    newValues.r3Number = newR3Number;
    setFormData(newValues);
    document.querySelector('#r3NumberToggle') &&
    document.querySelector('#r3NumberToggle').checked
      ? createR3(formData, navigate, creatingR3, r3Id)
      : createR3(newValues, navigate, creatingR3, r3Id);
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
            />
            <input
              type='text'
              placeholder={
                document.querySelector('#r3NumberToggle') &&
                document.querySelector('#r3NumberToggle').checked
                  ? 'Enter a R3 Number'
                  : 'Select an EQU No. to generate an R3 No.'
              }
              name='r3Number'
              id='r3Number'
              value={
                document.querySelector('#r3NumberToggle') &&
                document.querySelector('#r3NumberToggle').checked
                  ? formData.r3Number
                  : newR3Number
                  ? newR3Number
                  : ''
              }
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
            onChange={onChangeR3Date}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Remark</small>
          <input
            type='text'
            placeholder='GD...'
            name='remark'
            id='remark'
            value={formData.remark}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>EQU No.</small>
          {machines.length > 0 && (
            <Select
              name='machines'
              id='machines'
              placeholder='Select or type in an EQU No.'
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
          {failureCode.codes.length > 0 && (
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
            {document.querySelector('#machineStopped') &&
            document.querySelector('#machineStopped').checked
              ? 'Machine is stopped'
              : 'Machine is still running'}
          </small>
          <ToggleSwitch
            name='machineStopped'
            id='machineStopped'
            defaultChecked={setToggleMachineStoppedOn}
            onClick={onChange}
            color='danger'
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Repair Engineer</small>
          {users.length > 0 && (
            <Select
              name='repairEngineer'
              id='repairEngineer'
              placeholder='Select the person in charge of the repair'
              defaultValue={defaultRepairEngineer}
              key={formData.repairEngineer && formData.repairEngineer._id}
              onChange={onChangeRepairEngineer}
              options={optionRepairEngineer}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>

        <div className='form-group'>
          <small className='form-text'>Repair Code</small>
          {repairCode.codes.length > 0 && (
            <Select
              name='repairCode'
              id='repairCode'
              placeholder='Select a Repair Code'
              defaultValue={defaultRepairCode}
              key={formData.repairCode && formData.repairCode._id}
              onChange={onChangeRepairCode}
              options={optionRepairCodes}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>
        <div className='form-group'>
          <textarea
            type='textarea'
            rows='4'
            placeholder='Record of the repair'
            name='repairExplanation'
            id='repairExplanation'
            value={formData.repairExplanation}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <textarea
            rows='4'
            placeholder='修理情况'
            name='repairExplanationCN'
            id='repairExplanationCN'
            value={formData.repairExplanationCN}
            onChange={onChange}
          />
        </div>

        <div className='form-group'>
          <small className='form-text'>Analysis Code</small>
          {analysisCode.codes.length > 0 && (
            <Select
              name='analysisCode'
              id='analysisCode'
              placeholder='Select an Analysis Code'
              defaultValue={defaultAnalysisCode}
              key={formData.analysisCode && formData.analysisCode._id}
              onChange={onChangeAnalysisCode}
              options={optionAnalysisCodes}
              menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
            />
          )}
        </div>
        <div className='form-group'>
          <textarea
            type='textarea'
            rows='4'
            placeholder='Root Cause Analysis'
            name='analysisExplanation'
            id='analysisExplanation'
            value={formData.analysisExplanation}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <textarea
            rows='4'
            placeholder='根本原因分析'
            name='analysisExplanationCN'
            id='analysisExplanationCN'
            value={formData.analysisExplanationCN}
            onChange={onChange}
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
              onClick={() => deleteR3(r3Id, navigate)}
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
  failureCode: PropTypes.object.isRequired,
  repairCode: PropTypes.object.isRequired,
  analysisCode: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  createR3: PropTypes.func.isRequired,
  getR3: PropTypes.func.isRequired,
  getNewR3Number: PropTypes.func.isRequired,
  getMachines: PropTypes.func.isRequired,
  getCodes: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  machine: state.machine,
  user: state.user,
  failureCode: state.failureCode,
  repairCode: state.repairCode,
  analysisCode: state.analysisCode,
});

export default connect(mapStateToProps, {
  createR3,
  getR3,
  deleteR3,
  getNewR3Number,
  getMachines,
  getCodes,
  getUsers,
})(R3Form);
