import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getLocations } from '../../actions/location';
import LocationItem from './LocationItem';
import { Link } from 'react-router-dom';

const Locations = ({ getLocations, location: { locations, loading } }) => {
  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-location'> </i> Locations
          </h1>
          <div className='locations'>
            {locations && locations.length > 0 ? (
              locations.map((location) => (
                <Link key={location._id} to={`/locations/${location._id}`}>
                  <LocationItem key={location._id} location={location} />
                </Link>
              ))
            ) : (
              <h4>No Location found</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Locations.propTypes = {
  getLocations: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.location,
});

export default connect(mapStateToProps, { getLocations })(Locations);
