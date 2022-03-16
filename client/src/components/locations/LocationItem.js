import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

const LocationItem = ({ location }) => {
  // will return undefined if url has no params
  // will return the id for a single item if in the params (so a single card shown)
  const { locationId } = useParams();

  return (
    <div className='locations-grid-item bg-white'>
      <h2 className='location-initials'>{location.code}</h2>
      {locationId !== location._id && (
        <div className='card-button-more'>
          <Link to={`/locations/${location._id}`}>
            <i className='fa-solid fa-angles-right'></i>
          </Link>
        </div>
      )}
      <div className='location-letter'>
        Location Letter: {location.locationLetter}
      </div>
      <div className='location-name'>{location.name}</div>
      <div className='location-floor'>Floor: {location.floor}</div>
    </div>
  );
};

LocationItem.propTypes = {
  location: PropTypes.object.isRequired,
};

export default LocationItem;
