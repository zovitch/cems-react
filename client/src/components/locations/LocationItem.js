import React from 'react';
import PropTypes from 'prop-types';

const LocationItem = ({ location }) => {
  return (
    <div className='location-card card-nohover bg-white'>
      <h2 className='location-initials'>{location.code}</h2>

      <div className='location-letter'>
        Location Letter {location.locationLetter}
      </div>
      <div className='location-name'>{location.name}</div>
      <div className='location-floor'>Floor {location.floor}</div>
    </div>
  );
};

LocationItem.propTypes = {
  location: PropTypes.object.isRequired,
};

export default LocationItem;
