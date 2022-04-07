import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import nth from '../../utils/nth';

const DepartmentItem = ({ department }) => {
  return (
    <div className='department-card card-nohover bg-white'>
      <h2 className='department-trigram '>{department.trigram}</h2>
      <div className='department-name'>{department.name}</div>
      {department.location && (
        <small className='department-location'>
          Location{' '}
          <Link to={`/locations/${department.location._id}`}>
            {nth(department.location.floor) +
              ' floor ' +
              department.location.initials}
          </Link>
        </small>
      )}

      {department.owners.length > 1 ? (
        <small className='department-ownerLabel'>Owners </small>
      ) : (
        <small className='department-ownerLabel'>Owner </small>
      )}

      <div className='department-owners '>
        {department.owners.map((owner) => (
          <Link key={owner._id} to={`/users/${owner._id}`}>
            <Avatar
              className='badge'
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
