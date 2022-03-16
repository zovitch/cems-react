import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link, useParams } from 'react-router-dom';

const DepartmentItem = ({ department }) => {
  // will return undefined if url has no params
  // will return the id for a single item if in the params (so a single card shown)
  const { departmentId } = useParams();

  return (
    <div className='departments-grid-item bg-white'>
      <h2 className='department-trigram '>{department.trigram}</h2>
      {departmentId !== department._id && (
        <div className='card-button-more '>
          <Link to={`/departments/${department._id}`}>
            <i className='fa-solid fa-angles-right'></i>
          </Link>
        </div>
      )}
      <div className='department-name'>{department.name}</div>
      {department.location && (
        <small className='department-location'>
          Location:{' '}
          <Link to={`/locations/${department.location._id}`}>
            {department.location.floor + '/F ' + department.location.initials}
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
