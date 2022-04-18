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
  codetype,
  code: { code },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { codeId } = useParams();
  let creatingCode = true;
  if (codeId) {
    creatingCode = false;
  }

  useEffect(() => {
    if (!creatingCode && !code) {
      getCode(codeId, codetype);
    }
    if (code && !code.loading) {
      const codeData = { ...initialState };
      for (const key in code) {
        if (key in codeData) codeData[key] = code[key];
      }
      setFormData(codeData);
    }
  }, [code, codeId, codetype, creatingCode, getCode]);

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
  code: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  code: state.code,
});

export default connect(mapStateToProps, {
  createCode,
  getCode,
  deleteCode,
})(CodeForm);
