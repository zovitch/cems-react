import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LocationItem = ({
  location: { shortname, name, floor, locationLetter },
}) => {
  return (
    <div className='locations-item bg-light'>
      <h2 className='location-shortname'>{shortname}</h2>
      <div className='location-locationLetter '>
        R3 code: <h3>{locationLetter}</h3>
      </div>
      <div className='line'></div>
      <div className='line'></div>
      <div className='location-name'>{name}</div>
      <div className='location-floor'>Floor: {floor}</div>
    </div>
  );
};

LocationItem.propTypes = {};

export default LocationItem;
