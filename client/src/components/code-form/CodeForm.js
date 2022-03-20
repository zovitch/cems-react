import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createFailureCode,
  getFailureCode,
  deleteFailureCode,
} from '../../actions/code';

const initialState = {
  codeNumber: '',
  name: '',
  description: '',
  descriptionCN: '',
};

const CodeForm = ({
  createFailureCode,
  getFailureCode,
  deleteFailureCode,
  auth,
  failureCode: { code },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { codeId } = useParams();
  let creatingCode = true;
  if (codeId) creatingCode = false;

  useEffect(() => {
    if (!code) getFailureCode(codeId);

    if (code && !code.loading) {
      const codeData = { ...initialState };
      for (const key in code) {
        if (key in codeData) codeData[key] = code[key];
      }
      setFormData(codeData);
    }
  }, [code, codeId, creatingCode, getFailureCode]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    createFailureCode(formData, navigate, creatingCode, codeId);
  };

  return (
    <section className='container'>
      <h1 className='large text-failure'>
        <i className='fas fa-code'></i>{' '}
        {creatingCode ? 'Create a new Code' : 'Edit Code'}
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
        <Link className='btn btn-light my-1' to='/failurecodes'>
          Go Back
        </Link>
      </form>
      {creatingCode === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteFailureCode(codeId, navigate)}
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
  failureCode: PropTypes.object.isRequired,
  createFailureCode: PropTypes.func.isRequired,
  getFailureCode: PropTypes.func.isRequired,
  deleteFailureCode: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  failureCode: state.failureCode,
});

export default connect(mapStateToProps, {
  createFailureCode,
  getFailureCode,
  deleteFailureCode,
})(CodeForm);
