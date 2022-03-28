import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getLocations } from '../../actions/location';
import { Link } from 'react-router-dom';

const Locations = ({
  getLocations,
  auth,
  location: { locations, loading },
}) => {
  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='pageHeader'>
            <h1 className='large text-primary pageTitle'>
              <i className='fas fa-location'> </i> Locations
            </h1>
            <div className='pageActions'>
              {auth && auth.isAuthenticated && auth.loading === false && (
                <AddNew item='location' />
              )}
            </div>
          </div>

          <ol className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-5'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Floor</div>
              <div className='attribute'>R3 Letter</div>
              <div className='attribute'>Code</div>
              <div className='attribute'>Name</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {locations && locations.length > 0 ? (
              locations.map((location) => (
                <li
                  key={location._id}
                  className='item item-container item-container-5'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/locations/edit/${location._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Floor'>
                    {location.floor}
                  </div>
                  <div className='attribute' data-name='R3 Letter'>
                    {location.locationLetter}
                  </div>
                  <div className='attribute' data-name='Code'>
                    {location.code}
                  </div>
                  <div className='attribute' data-name='Name'>
                    {location.name}
                  </div>
                </li>
              ))
            ) : (
              <h4>No location found</h4>
            )}
          </ol>
        </Fragment>
      )}
    </section>
  );
};

Locations.propTypes = {
  getLocations: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.location,
  auth: state.auth,
});

export default connect(mapStateToProps, { getLocations })(Locations);
