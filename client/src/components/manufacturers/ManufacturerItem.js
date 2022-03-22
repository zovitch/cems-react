import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

const ManufacturerItem = ({ manufacturer }) => {
  // will return undefined if url has no params
  // will return the id for a single item if in the params (so a single card shown)
  const { manufacturerId } = useParams();

  return (
    <div className='manufacturers-grid-item bg-white'>
      {manufacturerId !== manufacturer._id && (
        <div className='card-button-more'>
          <Link to={`/manufacturers/${manufacturer._id}`}>
            <i className='fa-solid fa-angles-right'></i>
          </Link>
        </div>
      )}
      <h2 className='manufacturer-name'>{manufacturer.name}</h2>
      <h2 className='manufacturer-nameCN'> {manufacturer.nameCN}</h2>
    </div>
  );
};

ManufacturerItem.propTypes = {
  manufacturer: PropTypes.object.isRequired,
};

export default ManufacturerItem;
