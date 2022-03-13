import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const DepartmentItem = ({
  department: { trigram, name, location, owners },
}) => {
  return (
    <div className='departments-grid-item bg-light'>
      <h2 className='department-trigram'>{trigram}</h2>
      <div className='department-name'>{name}</div>

      <h5 className='department-location'>{location.name}</h5>
      <div className='department-owners '>
        {owners.length > 0 &&
          owners.map((owner) => (
            <Link key={owner._id} to={`/users/${owner._id}`}>
              <Avatar
                className='badge '
                name={owner.name}
                round={true}
                size='30px'
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentItem;
