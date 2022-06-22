import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getLocation } from '../../actions/location';
import PageTitleBarSingleViewAdmin from '../layout/PageTitleBarSingleViewAdmin';
import LocationItem from '../locations/LocationItem';

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
          <PageTitleBarSingleViewAdmin item='location' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-location'></i> Location
              </div>
              <LocationItem location={location} />
            </div>
            {/* <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-question'></i> Some Other stuff @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div> */}
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
