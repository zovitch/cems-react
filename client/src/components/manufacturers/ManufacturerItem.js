import React from 'react';
import PropTypes from 'prop-types';

const ManufacturerItem = ({ manufacturer }) => {
  return (
    <div className='manufacturer-card card-nohover bg-white'>
      <h2 className='manufacturer-name'>{manufacturer.name}</h2>
      <h2 className='manufacturer-nameCN'>{manufacturer.nameCN}</h2>
    </div>
  );
};

ManufacturerItem.propTypes = {
  manufacturer: PropTypes.object.isRequired,
};

export default ManufacturerItem;
