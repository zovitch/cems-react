import React from 'react';
import PropTypes from 'prop-types';

const DepartmentTop = ({ department: { trigram, name } }) => {
  return (
    <div className='post bg-light p-1'>
      <h1 className='large m-2 text-primary'>{trigram}</h1>
      <h2 className='lead'>{name}</h2>
    </div>
  );
};

DepartmentTop.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentTop;
