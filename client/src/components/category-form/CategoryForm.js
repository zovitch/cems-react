import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createCategory,
  getCategory,
  deleteCategory,
} from '../../actions/category';

const initialState = {
  code: '',
  trigram: '',
  description: '',
  descriptionCN: '',
};

const CategoryForm = ({
  createCategory,
  getCategory,
  deleteCategory,
  category: { category },
}) => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  let creatingCategory = true;
  if (categoryId) creatingCategory = false;

  useEffect(() => {
    !category && categoryId && getCategory(categoryId);

    if (category && !category.loading) {
      const categoryData = { ...initialState };
      for (const key in category) {
        if (key in categoryData) categoryData[key] = category[key];
      }
      setFormData(categoryData);
    }
  }, [category, categoryId, getCategory]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createCategory(formData, navigate, creatingCategory, categoryId);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-tag'></i>{' '}
        {creatingCategory ? 'Create a new Category' : 'Edit Category'}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Code</small>
          <input
            type='text'
            placeholder='ex: 123'
            name='code'
            value={formData.code}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Trigram</small>
          <input
            type='text'
            placeholder='ex: ABC'
            name='trigram'
            value={formData.trigram}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Description</small>
          <input
            type='text'
            placeholder='Enter a Description'
            name='description'
            value={formData.description}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Description in Chinese</small>
          <input
            type='text'
            placeholder='Enter a Description in Chinese'
            name='descriptionCN'
            value={formData.descriptionCN}
            onChange={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/categories'>
          Go Back
        </Link>
      </form>
      {creatingCategory === false && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteCategory(categoryId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Category
            </button>
          </div>
        </>
      )}
    </section>
  );
};

CategoryForm.propTypes = {
  category: PropTypes.object.isRequired,
  createCategory: PropTypes.func.isRequired,
  getCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  category: state.category,
});
export default connect(mapStateToProps, {
  createCategory,
  getCategory,
  deleteCategory,
})(CategoryForm);
