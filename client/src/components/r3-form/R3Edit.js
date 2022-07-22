import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  engineeringRepairDate: '',
  applicantValidationDate: '',
  r3Completed: false,
  remark: '',
};

const R3Edit = ({
  r3Display,
  r3: { newR3Number },
  machine: { machines },
  auth: { user },
  user: { users },
  code: { failureCodes, repairCodes, analysisCodes },
  createR3,
  getR3,
  getNewR3Number,
  getMachines,
  getUsers,
  getCodes,
  deleteR3,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [toggleMachineStoppedOn, setTogglemachineStoppedOn] = useState(false);
  const [toggleMaintenanceOilOn, setToggleMaintenanceOilOn] = useState(false);
  const [toggleMaintenancePlasticOn, setToggleMaintenancePlasticOn] =
    useState(false);
  const [toggleMaintenanceSparePartsOn, setToggleMaintenanceSparePartsOn] =
    useState(false);
  const [toggleR3Completed, setToggleR3Completed] = useState(false);
  const navigate = useNavigate();
  // const { r3Id } = useParams();
  let creatingR3 = false;
  const r3Id = r3Display._id;

  // if we create a R3 (creatingR3: true) then the toogle should be OFF (false)
  // if we edit a R3 (creatingR3: false) then toggle should be ON (true)
  const [toggleR3NumberOn, setToggleR3NumberOn] = useState(true);

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

  const optionFailureCodes = failureCodes.map((e) => ({
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
  const optionRepairCodes = repairCodes.map((e) => ({
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
  const optionAnalysisCodes = analysisCodes.map((e) => ({
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

  const optionRepairEngineer = users
    .filter((e) => e.isEngineer)
    .map((e) => ({
      value: e._id,
      label: e.name,
    }));

  useEffect(() => {
    !r3Display && r3Id && getR3(r3Id);
  }, [getR3, r3Display, r3Id]);

  useEffect(() => {
    !machines.length > 0 && getMachines();
  }, [getMachines, machines.length]);

  useEffect(() => {
    !failureCodes.length > 0 && getCodes('failure');
  }, [failureCodes.length, getCodes]);

  useEffect(() => {
    !repairCodes.length > 0 && getCodes('repair');
  }, [getCodes, repairCodes.length]);

  useEffect(() => {
    !analysisCodes.length > 0 && getCodes('analysis');
  }, [analysisCodes.length, getCodes]);

  useEffect(() => {
    !users.length > 0 && getUsers();
  }, [getUsers, users.length]);

  useEffect(() => {
    if (r3Display && !r3Display.loading) {
      const r3Data = { ...initialState };
      for (const key in r3Display) {
        if (key in r3Data) r3Data[key] = r3Display[key];
      }
      setFormData(r3Data);
      setTogglemachineStoppedOn(r3Data.machineStopped);
      setToggleMaintenanceOilOn(r3Data.maintenanceOilWaste);
      setToggleMaintenancePlasticOn(r3Data.maintenancePlasticAndMetalWaste);
      setToggleMaintenanceSparePartsOn(r3Data.maintenanceSpareParts);
      setToggleR3Completed(r3Data.r3Completed);
    }
  }, [r3Display]);

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
      ? createR3(formData, navigate, false, r3Id)
      : createR3(newValues, navigate, false, r3Id);
    window.scrollTo(0, 0);
  };

  return (
    <section className='container-large'>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group r3Form p'>
          <div className='compactView-1'>
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
            <small className='form-text'>
              {document.querySelector('#machineStopped') &&
              document.querySelector('#machineStopped').checked
                ? 'Machine is stopped'
                : 'Machine is still running'}
            </small>
            <ToggleSwitch
              name='machineStopped'
              id='machineStopped'
              defaultChecked={toggleMachineStoppedOn}
              onClick={onChange}
              color='danger'
            />

            <input
              type='text'
              placeholder='报修人员 Applicant'
              name='applicant'
              id='applicant'
              value={formData.applicant}
              onChange={onChange}
            />

            {user && user.isEngineer ? (
              <input
                type='text'
                placeholder={
                  document.querySelector('#r3NumberToggle') &&
                  document.querySelector('#r3NumberToggle').checked
                    ? 'Enter a R3 Number'
                    : 'Automatic R3 No.'
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
            ) : (
              <h2>{formData.r3Number}</h2>
            )}

            {user && user.isEngineer && (
              <ToggleSwitch
                name='r3NumberToggle'
                id='r3NumberToggle'
                defaultChecked={toggleR3NumberOn}
                onClick={onToggleR3Number}
              />
            )}
          </div>
        </div>

        <div className='form-group r3Form p'>
          <div className='compactView-2'>
            <small className='form-text'>Failure Code</small>
          </div>

          <div className='compactView-2'>
            {failureCodes.length > 0 && (
              <Select
                name='failureCode'
                id='failureCode'
                placeholder='Failure Code'
                defaultValue={defaultFailureCode}
                key={formData.failureCode && formData.failureCode._id}
                onChange={onChangeFailureCode}
                options={optionFailureCodes}
                menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
              />
            )}
            <span>
              <textarea
                rows='4'
                placeholder='报修说明'
                name='failureExplanationCN'
                id='failureExplanationCN'
                value={formData.failureExplanationCN}
                onChange={onChange}
              />
              <textarea
                type='textarea'
                rows='4'
                placeholder='Describe the problem'
                name='failureExplanation'
                id='failureExplanation'
                value={formData.failureExplanation}
                onChange={onChange}
              />
            </span>
          </div>
        </div>
        <div className='form-group r3Form p'>
          <div className='compactView-2'>
            <span>
              <small className='form-text'>R3 Application Date</small>
              <input
                type='date'
                placeholder='R3 Application Date'
                name='r3Date'
                id='r3Date'
                value={formData.r3Date && formatDate(formData.r3Date)}
                onChange={onChangeR3Date}
              />
            </span>

            <span>
              <small className='form-text'>Remark</small>
              <input
                type='text'
                placeholder='GD...'
                name='remark'
                id='remark'
                value={formData.remark}
                onChange={onChange}
              />
            </span>
          </div>
        </div>
        <div className='form-group r3Engineer p'>
          <div className='compactView-2'>
            <span>
              <small className='form-text'>Repair Engineer</small>
              {users.length > 0 && user.isEngineer ? (
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
              ) : (
                <h2>
                  {formData.repairEngineer && formData.repairEngineer.name}
                </h2>
              )}
            </span>
            <span>
              <small className='form-text'>工程师反馈 Engineer Feedback</small>
              <textarea
                type='textarea'
                rows='2'
                placeholder='...'
                name='engineeringRemark'
                id='engineeringRemark'
                value={formData.engineeringRemark}
                onChange={onChange}
                readOnly={user && user.isEngineer === false}
              />
            </span>
          </div>
        </div>
        {!creatingR3 && (
          <div className='form-group r3Form p'>
            <small className='form-text'>Applicant Validation Date</small>

            <input
              type='date'
              placeholder='Applicant Validation Date'
              name='applicantValidationDate'
              id='applicantValidationDate'
              value={
                formData.applicantValidationDate &&
                formatDate(formData.applicantValidationDate)
              }
              onChange={onChange}
            />
          </div>
        )}

        {/* Below is to be shown only for Engineering Team */}

        {user && user.isEngineer && (
          <span>
            <div className='form-group r3Engineer p'>
              <div className='compactView-2'>
                <small className='form-text'>Repair Code</small>
              </div>

              <div className='compactView-2'>
                {repairCodes.length > 0 && (
                  <span>
                    <Select
                      name='repairCode'
                      id='repairCode'
                      placeholder='Repair Code'
                      defaultValue={defaultRepairCode}
                      key={formData.repairCode && formData.repairCode._id}
                      onChange={onChangeRepairCode}
                      options={optionRepairCodes}
                      menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
                    />
                  </span>
                )}
                <span>
                  <textarea
                    rows='4'
                    placeholder='修理情况'
                    name='repairExplanationCN'
                    id='repairExplanationCN'
                    value={formData.repairExplanationCN}
                    onChange={onChange}
                  />
                  <textarea
                    type='textarea'
                    rows='4'
                    placeholder='Record of the repair'
                    name='repairExplanation'
                    id='repairExplanation'
                    value={formData.repairExplanation}
                    onChange={onChange}
                  />
                </span>
              </div>
            </div>
            <div className='form-group r3Engineer p'>
              <div className='compactView-2'>
                <small className='form-text'>Analysis Code</small>
              </div>
              <div className='compactView-2'>
                {analysisCodes.length > 0 && (
                  <span>
                    <Select
                      name='analysisCode'
                      id='analysisCode'
                      placeholder='Analysis Code'
                      defaultValue={defaultAnalysisCode}
                      key={formData.analysisCode && formData.analysisCode._id}
                      onChange={onChangeAnalysisCode}
                      options={optionAnalysisCodes}
                      menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
                    />
                  </span>
                )}
                <span>
                  <textarea
                    rows='4'
                    placeholder='根本原因分析'
                    name='analysisExplanationCN'
                    id='analysisExplanationCN'
                    value={formData.analysisExplanationCN}
                    onChange={onChange}
                  />
                  <textarea
                    type='textarea'
                    rows='4'
                    placeholder='Root Cause Analysis'
                    name='analysisExplanation'
                    id='analysisExplanation'
                    value={formData.analysisExplanation}
                    onChange={onChange}
                  />
                </span>
              </div>
            </div>
            <div className='form-group r3Engineer p'>
              <div className='compactView-2'>
                <span>
                  <small className='form-text'>
                    Maintenance Oil & Solvant Waste
                  </small>
                  <ToggleSwitch
                    name='maintenanceOilWaste'
                    id='maintenanceOilWaste'
                    defaultChecked={toggleMaintenanceOilOn}
                    onClick={onChange}
                  />
                  <small className='form-text'>
                    Maintenance Plastic & Metal Waste
                  </small>
                  <ToggleSwitch
                    name='maintenancePlasticAndMetalWaste'
                    id='maintenancePlasticAndMetalWaste'
                    defaultChecked={toggleMaintenancePlasticOn}
                    onClick={onChange}
                  />
                  <small className='form-text'>Maintenance Spare Parts</small>
                  <ToggleSwitch
                    name='maintenanceSpareParts'
                    id='maintenanceSpareParts'
                    defaultChecked={toggleMaintenanceSparePartsOn}
                    onClick={onChange}
                  />
                </span>

                <span>
                  <span>
                    <small className='form-text'>Engineering Repair Date</small>
                    <input
                      type='date'
                      placeholder='Engineering Repair Date'
                      name='engineeringRepairDate'
                      id='engineeringRepairDate'
                      value={
                        formData.engineeringRepairDate &&
                        formatDate(formData.engineeringRepairDate)
                      }
                      onChange={onChange}
                    />
                  </span>
                  <br />
                  <small className='form-text'>R3 Completed?</small>
                  <ToggleSwitch
                    name='r3Completed'
                    id='r3Completed'
                    defaultChecked={toggleR3Completed}
                    onClick={onChange}
                  />
                </span>
              </div>
            </div>
          </span>
        )}

        <input
          type='submit'
          id='submit'
          value={` ${r3Display && r3Display.loading ? 'Wait' : 'Save'}`}
          className={`btn ${
            r3Display && r3Display.loading ? 'btn-light' : 'btn-primary'
          } my-1`}
          disabled={r3Display && r3Display.loading ? true : false}
        />
        {/* <Link className='btn btn-light my-1' to='/r3s'>
          Go Back
        </Link> */}
      </form>
      {creatingR3 === false && user.isAdmin && (
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

R3Edit.propTypes = {
  r3: PropTypes.object.isRequired,
  r3Display: PropTypes.object.isRequired,
  machine: PropTypes.object.isRequired,
  code: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
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
  code: state.code,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createR3,
  getR3,
  deleteR3,
  getNewR3Number,
  getMachines,
  getCodes,
  getUsers,
})(R3Edit);
