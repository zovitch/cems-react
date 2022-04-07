import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';

const ProfileItem = ({ user: { _id, name } }) => {
  return (
    <div className='profile-card card-nohover bg-white'>
      <div className='profile-avatar'>
        <Avatar name={name} round={true} className size='55' />
      </div>
      <h3 className='profile-name'>{name}</h3>
    </div>
  );
};

ProfileItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileItem;
