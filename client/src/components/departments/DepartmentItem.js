import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link, useParams } from 'react-router-dom';

const DepartmentItem = ({ department }) => {
  const { trigram } = useParams();

  return (
    <div className='departments-grid-item bg-white'>
      <h2 className='department-trigram '>{department.trigram}</h2>
      {trigram !== department.trigram && (
        <div className='card-button-more '>
          <Link to={`/departments/${department.trigram}`}>
            <i className='fa-solid fa-angles-right  '></i>
          </Link>
        </div>
      )}
      <div className='department-name'>{department.name}</div>
      <small className='department-location'>
        Location: {department.location.name}
      </small>
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
            {/* <small> {owner.name}</small> */}
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
