import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const DepartmentItem = ({
  department: { trigram, name, location, owners },
}) => {
  return (
    <div className='department-item bg-light'>
      <Link className='trigram' to={`/departments/${trigram}`}>
        <h2>{trigram}</h2>
      </Link>
      <div className='name'>{name}</div>

      <div className='line'></div>
      <div>
        {owners.length > 0 &&
          owners.map((owner) => (
            <Link
              className='owners badge'
              key={owner._id}
              to={`/users/${owner._id}`}
            >
              <Avatar name={owner.name} round={true} size='30px' />
            </Link>
          ))}
      </div>
      <h5 className='location'>{location.name}</h5>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
