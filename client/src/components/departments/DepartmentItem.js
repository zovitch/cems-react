import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const DepartmentItem = ({
  department: { trigram, name, location, owners },
}) => {
  return (
    <div className='profile bg-light'>
      <Link to={`/departments/${trigram}`}>
        <h2>{trigram}</h2>
      </Link>
      <div>
        <Link to={`/departments/${trigram}`}>
          <h2>{name}</h2>
          <p>Location: {location.name}</p>
        </Link>
      </div>
      {owners.length > 0 &&
        owners.map((owner) => (
          <Link key={owner._id} to={`/users/${owner._id}`}>
            <Avatar name={owner.name} round={true} size='50px' />
          </Link>
        ))}
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
