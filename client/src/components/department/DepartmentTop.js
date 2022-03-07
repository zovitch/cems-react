import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const DepartmentTop = ({ department: { trigram, name, location, owners } }) => {
  return (
    <div>
      {' '}
      <div> this should be a form</div>
      <div className='profile'>
        <h2>{trigram}</h2>
        <div>
          <h2>{name}</h2>
          <p>Location: {location.name}</p>
        </div>
        {owners.length > 0 &&
          owners.map((owner) => (
            <Link to={`/users/${owner._id}`}>
              <Avatar name={owner.name} round={true} size='50px' />
            </Link>
          ))}
      </div>
    </div>
  );
};

DepartmentTop.propTypes = {
  department: PropTypes.object.isRequired,
};

export default DepartmentTop;
