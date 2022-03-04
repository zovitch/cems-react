import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';

const ProfileTop = ({ user: { name, email } }) => {
  return (
    <div className='post bg-light p-1'>
      <Avatar name={name} round={true} textSizeRatio='1.2' maxInitials='3' />
      <h1 className='large m-2 text-primary'>{name}</h1>
    </div>
  );
};

ProfileTop.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileTop;
