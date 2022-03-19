import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const CodeItem = ({ code, auth }) => {
  // will return undefined if url has no params
  // will return the id for a single item if in the params (so a single card shown)
  const { codeId } = useParams();

  return (
    <div className='codes-grid-item bg-white'>
      <h2 className='code-codeNumber'>{code.codeNumber}</h2>
      <h2 className='code-name'>{code.name}</h2>
      {auth.isAuthenticated && auth.loading === false && codeId !== code._id && (
        <div className='card-button-more'>
          <Link to={`/codes/edit/${code._id}`}>
            <i className='fa-solid fa-edit'></i>
          </Link>
        </div>
      )}
      <div className='code-description'>{code.description}</div>
      <div className='code-descriptionCN'>{code.descriptionCN}</div>
    </div>
  );
};

CodeItem.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, null)(CodeItem);
