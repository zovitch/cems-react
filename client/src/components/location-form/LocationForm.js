import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  // getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../../actions/location';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */

const initialState = {
  initials: '',
  name: '',
  nameCN: '',
  floor: '',
  locationLetter: '',
  code: '',
};

const LocationForm = ({
  // getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  location: { location },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { locationId } = useParams();
  let creatingLocation = true;
  if (locationId) creatingLocation = false;

  useEffect(() => {
    if (location && !location.loading) {
      const locationData = { ...initialState };
      for (const key in location) {
        if (key in locationData) locationData[key] = location[key];
      }
      setFormData(locationData);
    }
  }, [location]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (creatingLocation) {
      createLocation(formData, navigate);
    } else {
      updateLocation(locationId, formData, navigate);
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-location'></i>{' '}
        {creatingLocation ? 'Create a new Location' : 'Edit Location'}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Initials</small>
          <input
            type='text'
            placeholder={`ex: 'WH' for Warehouse`}
            name='initials'
            value={formData.initials}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder='Name of the Location'
            name='name'
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Chinese Name</small>
          <input
            type='text'
            placeholder='Name of the Location in Chinese'
            name='nameCN'
            value={formData.nameCN}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Floor</small>
          <input
            type='text'
            placeholder={`ex: '1' for 1st floor`}
            name='floor'
            value={formData.floor}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Location Letter</small>
          <input
            type='text'
            placeholder='Single Letter used for R3'
            name='locationLetter'
            value={formData.locationLetter}
            onChange={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/locations'>
          Go Back
        </Link>
      </form>
      {creatingLocation === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteLocation(locationId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Location
            </button>
          </div>
        </>
      )}
    </section>
  );
};

LocationForm.propTypes = {
  location: PropTypes.object.isRequired,
  // getLocation: PropTypes.func.isRequired,
  createLocation: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  deleteLocation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.location,
});

export default connect(mapStateToProps, {
  // getLocation,
  updateLocation,
  createLocation,
  deleteLocation,
})(LocationForm);
