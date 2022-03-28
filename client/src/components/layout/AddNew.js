import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const AddNew = ({ item }) => {
  return (
    <Link to={`/create-${item}`}>
      <div className='addNewbtn btn-light '>
        <h4>
          <i className='fas fa-circle-plus fa-2xl ' />{' '}
          <span className='hide-sm'>
            {item[0].toUpperCase() + item.substring(1)}
          </span>
        </h4>
      </div>
    </Link>
  );
};

AddNew.propTypes = {
  item: PropTypes.string.isRequired,
};

export default AddNew;
