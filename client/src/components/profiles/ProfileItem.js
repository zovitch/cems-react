import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

const ProfileItem = ({ user: { _id, name } }) => {
  const { id } = useParams();

  return (
    <div className='profiles-grid-item bg-white'>
      <div className='profile-avatar'>
        <Avatar name={name} round={true} className size='55' />
      </div>
      <h3 className='profile-name'>{name}</h3>
      {_id !== id && (
        <div className='profile-cta'>
          <Link to={`/users/${_id}`}>
            <i className='fa-solid fa-angles-right  '></i>
          </Link>
        </div>
      )}
    </div>
  );
};

ProfileItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileItem;
