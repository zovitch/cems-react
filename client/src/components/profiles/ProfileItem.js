import React from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

const ProfileItem = ({ user: { _id, name } }) => {
  return (
    <div className='profile bg-light'>
      <Link to={`/users/${_id}`}>
        <Avatar
          name={name}
          round={true}
          size='55'
          // textSizeRatio='1.2'
          // maxInitials='3'
        />{' '}
      </Link>
      <Link to={`/users/${_id}`}>
        <h2>{name}</h2>
      </Link>
    </div>
  );
};

ProfileItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileItem;
