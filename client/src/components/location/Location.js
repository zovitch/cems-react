import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getLocation } from '../../actions/location';
import LocationItem from '../locations/LocationItem';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

const Location = ({ getLocation, location: { location }, auth }) => {
  const { locationId } = useParams();
  useEffect(() => {
    getLocation(locationId);
  }, [getLocation, locationId]);

  return (
    <section className='container'>
      {location === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-location'></i> Location
          </h1>
          <Link to='/locations' className='btn btn-light'>
            Back to Locations
          </Link>
          {auth.isAuthenticated && auth.loading === false && (
            <Link to={`/locations/edit/${locationId}`} className='btn btn-dark'>
              Edit Location
            </Link>
          )}
          <div className='location-grid py-2'>
            <LocationItem location={location} />
          </div>
        </Fragment>
      )}
    </section>
  );
};

Location.propTypes = {
  getLocation: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.location,
  auth: state.auth,
});

export default connect(mapStateToProps, { getLocation })(Location);
