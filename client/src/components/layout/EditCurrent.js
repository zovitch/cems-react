import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EditCurrent = ({ item }) => {
  // const path=`/${link}/edit/:departmentId`

  const paramsId = Object.values(useParams());

  return (
    <Link to={`/${item}/edit/${paramsId}`}>
      <div className='editCurrentbtn btn-light '>
        <h4>
          <i className='fas fa-edit fa-2xl ' />{' '}
          <span className='hide-sm'>
            {/* {item[0].toUpperCase() + item.substring(1)} */}
            Edit
          </span>
        </h4>
      </div>
    </Link>
  );
};

EditCurrent.propTypes = {
  item: PropTypes.string.isRequired,
};

export default EditCurrent;
