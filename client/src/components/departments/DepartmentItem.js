import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DepartmentItem = ({ department: { trigram, name } }) => {
  return (
    <div className='profile bg-light'>
      <Link to={`/departments/${trigram}`}>
        <h2>{trigram}</h2>
        <div className='lead'>{name}</div>
      </Link>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
