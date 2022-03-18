import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

const CategoryItem = ({ category }) => {
  // will return undefined if url has no params
  // will return the id for a single item if in the params (so a single card shown)
  const { categoryId } = useParams();

  return (
    <div className='categories-grid-item bg-white'>
      <h2 className='category-code'>{category.code}</h2>
      <h2 className='category-trigram'>{category.trigram}</h2>
      {categoryId !== category._id && (
        <div className='card-button-more'>
          <Link to={`/categories/${category._id}`}>
            <i className='fa-solid fa-angles-right'></i>
          </Link>
        </div>
      )}
      <div className='category-description'>{category.description}</div>
      <div className='category-descriptionCN'>{category.descriptionCN}</div>
    </div>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryItem;
