import React from 'react';
import PropTypes from 'prop-types';

const CategoryItem = ({ category }) => {
  return (
    <div className='category-card card-nohover bg-white'>
      <h2 className='category-code'>{category.code}</h2>
      <h2 className='category-trigram'>{category.trigram}</h2>

      <div className='category-description'>{category.description}</div>
      <div className='category-descriptionCN'>{category.descriptionCN}</div>
    </div>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryItem;
