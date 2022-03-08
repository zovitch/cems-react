import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const DepartmentItem = ({
  department: { trigram, name, location, owners },
}) => {
  return (
    <div className='departments-item bg-light'>
      <Link className='department-trigram' to={`/departments/${trigram}`}>
        <h2>{trigram}</h2>
      </Link>
      <div className='department-name'>{name}</div>

      <div className='line'></div>
      <div>
        {owners.length > 0 &&
          owners.map((owner) => (
            <Link
              className='department-owners badge'
              key={owner._id}
              to={`/users/${owner._id}`}
            >
              <Avatar name={owner.name} round={true} size='30px' />
            </Link>
          ))}
      </div>
      <h5 className='department-location'>{location.name}</h5>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
