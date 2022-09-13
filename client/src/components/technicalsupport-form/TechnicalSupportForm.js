import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createTechnicalSupport,
  getTechnicalSupport,
  deleteTechnicalSupport,
} from '../../actions/technicalsupport';
import { getUsers } from '../../actions/user';
import Select from 'react-select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from '../layout/Spinner';
/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our technicalsupportData
 */

const initialState = {
  applicationDate: new Date(),
  expectedDate: '',
  description: '',
  requirement: '',
  reason: '',
  engineeringOpinion: '',
  engineer: '',
  opinionDate: '',
  orderTaker: '',
  projectedTime: '',
  progress: '',
  completionDate: '',
  applicantValidation: '',
};

const TechnicalSupportForm = ({
  createTechnicalSupport,
  getTechnicalSupport,
  deleteTechnicalSupport,
  getUsers,

  technicalsupport: { technicalsupport },
  auth: { user },
  user: { users },
}) => {
  const [formData, setFormData] = useState(initialState);
  const [selectedTechnicalsupportDate, setTechnicalsupportDate] = useState(
    new Date(),
  );
  const [
    selectedTechnicalsupportExpectedDate,
    setTechnicalsupportExpectedDate,
  ] = useState('');
  const [selectedTechnicalsupportOpinionDate, setTechnicalsupportOpinionDate] =
    useState('');
  const [
    selectedTechnicalsupportCompletionDate,
    setTechnicalsupportCompletionDate,
  ] = useState('');

  const navigate = useNavigate();
  const { technicalsupportId } = useParams();
  let creatingTechnicalsupport = true;
  if (technicalsupportId) creatingTechnicalsupport = false;

  const defaultOrderTaker = !formData.orderTaker
    ? ''
    : {
        value: formData.orderTaker._id,
        label: formData.orderTaker.name,
      };

  const defaultApplicantValidation = !formData.applicantValidation
    ? ''
    : {
        value: formData.applicantValidation._id,
        label: formData.applicantValidation.name,
      };

  const optionOrderTaker = users
    .filter((e) => e.isEngineer)
    .map((e) => ({
      key: e._id,
      value: e._id,
      label: e.name,
    }));

  const optionApplicantValidation = users
    .filter((e) => e._id.includes(user._id))
    .map((e) => ({
      key: e._id,
      value: e._id,
      label: e.name,
    }));

  useEffect(() => {
    !technicalsupport &&
      technicalsupportId &&
      getTechnicalSupport(technicalsupportId);

    if (technicalsupport && !technicalsupport.loading) {
      const technicalsupportData = { ...initialState };
      for (const key in technicalsupport) {
        if (key in technicalsupportData)
          technicalsupportData[key] = technicalsupport[key];
      }
      setFormData(technicalsupportData);
    }
  }, [getTechnicalSupport, technicalsupport, technicalsupportId]);

  useEffect(() => {
    !users.length > 0 && getUsers();
  }, [getUsers, users.length]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeTechnicalsupportDate = (e) => {
    setTechnicalsupportDate(e);
    const newValues = { ...formData };
    newValues.applicationDate = e;
    setFormData(newValues);
  };

  const onChangeTechnicalsupportExpectedDate = (e) => {
    setTechnicalsupportExpectedDate(e);
    const newValues = { ...formData };
    newValues.expectedDate = e;
    setFormData(newValues);
  };

  const onChangeTechnicalsupportOpinionDate = (e) => {
    setTechnicalsupportOpinionDate(e);
    const newValues = { ...formData };
    newValues.opinionDate = e;
    setFormData(newValues);
  };

  const onChangeTechnicalsupportCompletionDate = (e) => {
    setTechnicalsupportCompletionDate(e);
    const newValues = { ...formData };
    newValues.completionDate = e;
    setFormData(newValues);
  };

  const onChangeOrderTaker = (e) => {
    const newValues = { ...formData };
    newValues.orderTaker = {
      _id: e.value,
      name: e.label,
    };
    setFormData(newValues);
  };

  const onChangeApplicantValidation = (e) => {
    const newValues = { ...formData };
    newValues.applicantValidation = {
      _id: e.value,
      name: e.label,
    };
    setFormData(newValues);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createTechnicalSupport(
      formData,
      navigate,
      creatingTechnicalsupport,
      technicalsupportId,
    );
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-handshake-angle'></i>{' '}
        {creatingTechnicalsupport
          ? 'Create a new Technical Support Request'
          : 'Edit Technical Support Request'}
      </h1>
      <form
        className='form py'
        onSubmit={onSubmit}
      >
        <div className='form-group technicalSupportForm p'>
          <div className='form-group'>
            <small className='form-text'>申请人 Applicant</small>
            {user.name}
            <small className='form-text'>日期 Date</small>
            <DatePicker
              selected={selectedTechnicalsupportDate}
              onChange={onChangeTechnicalsupportDate}
              dateFormat='yyyy/MM/dd HH:mm'
              maxDate={new Date()}
              isClearable={false}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={5}
              todayButton='今天'
            />
          </div>
          <div className='form-group'>
            <small className='form-text'>申请内容 Description</small>
            <textarea
              rows='4'
              placeholder='申请内容'
              name='description'
              id='description'
              value={formData.description}
              onChange={onChange}
            />
            <small className='form-text'>技术 要求 Technical Requirement</small>
            <textarea
              rows='4'
              placeholder='技术 要求'
              name='requirement'
              id='requirement'
              value={formData.requirement}
              onChange={onChange}
            />
            <small className='form-text'>申请原因 Reason</small>
            <textarea
              rows='4'
              placeholder='申请原因'
              name='reason'
              id='reason'
              value={formData.reason}
              onChange={onChange}
            />
            <small className='form-text'>
              希望完成日期 Expected Completion Date
            </small>

            <DatePicker
              selected={selectedTechnicalsupportExpectedDate}
              onChange={onChangeTechnicalsupportExpectedDate}
              dateFormat='yyyy/MM/dd'
              minDate={new Date()}
              isClearable={false}
              todayButton='今天'
            />
          </div>
        </div>
        {(!creatingTechnicalsupport || user.isEngineer) && (
          <>
            <div className='form-group technicalSupportEngineer p'>
              <small className='form-text'>
                工程部门的意见 Engineering dept. opinion
              </small>
              <textarea
                rows='4'
                placeholder='工程部门的意见 opinion'
                name='engineeringOpinion'
                id='engineeringOpinion'
                value={formData.engineeringOpinion}
                onChange={onChange}
              />
              <small className='form-text'>
                项目总计用时 Estimated Project Time
              </small>
              <input
                type='text'
                placeholder='项目总计用时 Estimated Project Time'
                name='projectedTime'
                id='projectedTime'
                value={formData.projectedTime}
                onChange={onChange}
              />
              <small className='form-text'>接单人 Order Taker</small>
              <Select
                name='orderTaker'
                id='orderTaker'
                placeholder='Person in charge of the repair'
                defaultValue={defaultOrderTaker}
                key={formData.orderTaker && formData.orderTaker._id}
                onChange={onChangeOrderTaker}
                options={optionOrderTaker}
                menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
              />

              <small className='form-text'>日期 Opinion Date</small>

              <DatePicker
                selected={selectedTechnicalsupportOpinionDate}
                onChange={onChangeTechnicalsupportOpinionDate}
                dateFormat='yyyy/MM/dd HH:mm'
                isClearable={false}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={5}
                todayButton='今天'
              />
            </div>

            <div className='form-group technicalSupportEngineer p'>
              <small className='form-text'>项目进度 Project Progress</small>
              <textarea
                rows='4'
                placeholder='项目进度	Project Progress'
                name='progress'
                id='progress'
                value={formData.progress}
                onChange={onChange}
              />
              <small className='form-text'>
                实际完成日期 Actual Completion Date
              </small>
              <DatePicker
                selected={selectedTechnicalsupportCompletionDate}
                onChange={onChangeTechnicalsupportCompletionDate}
                dateFormat='yyyy/MM/dd'
                maxDate={new Date()}
                isClearable={false}
                todayButton='今天'
              />
            </div>
            <div className='form-group technicalSupportForm p'>
              <small className='form-text'>
                申请人确认 Applicant Validation
              </small>
              <Select
                name='applicantValidation'
                id='applicantValidation'
                placeholder='申请人确认 Applicant Validation'
                defaultValue={defaultApplicantValidation}
                key={
                  formData.applicantValidation &&
                  formData.applicantValidation._id
                }
                onChange={onChangeApplicantValidation}
                options={optionApplicantValidation}
                menuPortalTarget={document.querySelector('body')} //to avoid dropdown cut-out
              />
            </div>
          </>
        )}

        <input
          type='submit'
          value='Save'
          className='btn btn-primary my-1'
        />
        <Link
          className='btn btn-light my-1'
          to='/technicalsupports'
        >
          Go Back
        </Link>
      </form>
      {creatingTechnicalsupport === false && user.isAdmin && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() =>
                deleteTechnicalSupport(technicalsupportId, navigate)
              }
            >
              <i className='fas fa-trash' /> Delete the Techical Support
            </button>
          </div>
        </>
      )}
    </section>
  );
};

TechnicalSupportForm.propTypes = {
  createTechnicalSupport: PropTypes.func.isRequired,
  getTechnicalSupport: PropTypes.func.isRequired,
  deleteTechnicalSupport: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,

  technicalsupport: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  technicalsupport: state.technicalsupport,
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, {
  createTechnicalSupport,
  getTechnicalSupport,
  deleteTechnicalSupport,
  getUsers,
})(TechnicalSupportForm);
