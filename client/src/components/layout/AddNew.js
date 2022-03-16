import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const AddNew = ({ item }) => {
  return (
    <Link to={`/create-${item}`}>
      <div className='addNewbtn bg-light '>
        <h1>
          <i className='fas fa-circle-plus fa-2xl '></i>
        </h1>
        <h1>Add new {item[0].toUpperCase() + item.substring(1)} </h1>
      </div>
    </Link>
  );
};

AddNew.propTypes = {
  item: PropTypes.string.isRequired,
};

export default AddNew;
