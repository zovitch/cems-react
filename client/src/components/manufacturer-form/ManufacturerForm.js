import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createManufacturer,
  deleteManufacturer,
} from '../../actions/manufacturer';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our manufacturerData
 */

const initialState = {
  name: '',
  nameCN: '',
};

const ManufacturerForm = ({
  createManufacturer,
  deleteManufacturer,
  manufacturer: { manufacturer },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { manufacturerId } = useParams();
  let creatingManufacturer = true;
  if (manufacturerId) creatingManufacturer = false;

  useEffect(() => {
    if (manufacturer && !manufacturer.loading) {
      const manufacturerData = { ...initialState };
      for (const key in manufacturer) {
        if (key in manufacturerData) manufacturerData[key] = manufacturer[key];
      }
      setFormData(manufacturerData);
    }
  }, [manufacturer]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createManufacturer(
      formData,
      navigate,
      creatingManufacturer,
      createManufacturer && manufacturerId
    );
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-industry'></i>{' '}
        {creatingManufacturer
          ? 'Create a new Manufacturer'
          : 'Edit Manufacturer'}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder={`Name of the Manufacturer`}
            name='name'
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Name in Chinese</small>
          <input
            type='text'
            placeholder='Name of the Manufacturer'
            name='nameCN'
            value={formData.nameCN}
            onChange={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/manufacturers'>
          Go Back
        </Link>
      </form>
      {creatingManufacturer === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteManufacturer(manufacturerId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Manufacturer
            </button>
          </div>
        </>
      )}
    </section>
  );
};

ManufacturerForm.propTypes = {
  manufacturer: PropTypes.object.isRequired,
  createManufacturer: PropTypes.func.isRequired,
  deleteManufacturer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  manufacturer: state.manufacturer,
});

export default connect(mapStateToProps, {
  createManufacturer,
  deleteManufacturer,
})(ManufacturerForm);
