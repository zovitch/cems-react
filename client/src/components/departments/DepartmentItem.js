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
      <ul>
        {owners.map((owner, index) => (
          <li key={index} className='text-primary'>
            <Link to={`/users/${owner._id}`}>
              <Avatar
                name={owner.name}
                size='25px'
                round={true}
                textSizeRatio='1.2'
                // maxInitials='3'
              />{' '}
              {owner.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
