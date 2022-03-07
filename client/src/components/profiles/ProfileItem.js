import React, { useEffect } from 'react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getDepartments } from '../../actions/department';
import { Link } from 'react-router-dom';

const ProfileItem = ({
  getDepartments,
  department: { departments },
  user: { _id, name },
}) => {
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

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
      <div>
        {departments
          .filter((department) => department.owners.name === name)
          .map((filteredDepartment) => (
            <li>{filteredDepartment}</li>
          ))}
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  user: PropTypes.object.isRequired,
  department: PropTypes.object.isRequired,
  getDepartments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
});

export default connect(mapStateToProps, { getDepartments })(ProfileItem);
