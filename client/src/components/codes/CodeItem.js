import React from 'react';
import PropTypes from 'prop-types';

const CodeItem = ({ code }) => {
  return (
    <div className='code-card card bg-white'>
      <h2 className='code-codeNumber'>
        {String(code.codeNumber).padStart(2, '0')}
      </h2>
      <h2 className='code-name'>{code.name}</h2>

      <div className='code-description'>{code.description}</div>
      <div className='code-descriptionCN'>{code.descriptionCN}</div>
    </div>
  );
};

CodeItem.propTypes = {
  code: PropTypes.object.isRequired,
};

export default CodeItem;
