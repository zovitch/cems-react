import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createCode, getCode, deleteCode } from '../../actions/code';

const initialState = {
  codeNumber: '',
  name: '',
  description: '',
  descriptionCN: '',
};

const CodeForm = ({
  createCode,
  getCode,
  deleteCode,
  auth,
  codetype,
  failureCode,
  repairCode,
  analysisCode,
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { codeId } = useParams();
  let creatingCode = true;
  if (codeId) {
    creatingCode = false;
  }

  let codeFunction;
  switch (codetype) {
    case 'failure':
      codeFunction = failureCode;
      break;
    case 'repair':
      codeFunction = repairCode;
      break;
    case 'analysis':
      codeFunction = analysisCode;
      break;
    default:
      codeFunction = repairCode;
      break;
  }

  useEffect(() => {
    if (!creatingCode && !codeFunction.code) {
      getCode(codeId, codetype);
    }
    if (codeFunction.code && !codeFunction.code.loading) {
      const codeData = { ...initialState };
      for (const key in codeFunction.code) {
        if (key in codeData) codeData[key] = codeFunction.code[key];
      }
      setFormData(codeData);
    }
  }, [codeId, codetype, getCode, creatingCode, codeFunction.code]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    createCode(formData, navigate, creatingCode, codeId, codetype);
  };

  return (
    <section className='container'>
      <h1 className={`large text-${codetype}`}>
        <i className='fas fa-code'></i>{' '}
        {creatingCode
          ? `Create a new ${
              codetype[0].toUpperCase() + codetype.substring(1)
            } Code`
          : `Edit a ${codetype} Code`}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Code</small>
          <input
            type='text'
            placeholder='ex: 123'
            name='codeNumber'
            value={formData.codeNumber}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Trigram</small>
          <input
            type='text'
            placeholder='ex: ABC'
            name='name'
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Description</small>
          <input
            type='text'
            placeholder='Enter a Description'
            name='description'
            value={formData.description}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Description in Chinese</small>
          <input
            type='text'
            placeholder='Enter a Description in Chinese'
            name='descriptionCN'
            value={formData.descriptionCN}
            onChange={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to={`/${codetype}codes`}>
          Go Back
        </Link>
      </form>
      {creatingCode === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => {
                deleteCode(codetype, codeId, navigate);
                // small BUG: the useEffect will trigger again after the delete, and will try to getCode with the id that has just been deleted, will have to fix this bug later or not calling delete from the form
              }}
            >
              <i className='fas fa-trash' /> Delete the Code
            </button>
          </div>
        </>
      )}
    </section>
  );
};
CodeForm.propTypes = {
  createCode: PropTypes.func.isRequired,
  getCode: PropTypes.func.isRequired,
  deleteCode: PropTypes.func.isRequired,
  failureCode: PropTypes.object.isRequired,
  repairCode: PropTypes.object.isRequired,
  analysisCode: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  failureCode: state.analysisCode,
  repairCode: state.repairCode,
  analysisCode: state.analysisCode,
});

export default connect(mapStateToProps, {
  createCode,
  getCode,
  deleteCode,
})(CodeForm);
