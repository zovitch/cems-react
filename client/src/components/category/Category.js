import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getCategory } from '../../actions/category';
import CategoryItem from '../categories/CategoryItem';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

const Category = ({ getCategory, category: { category }, auth }) => {
  const { categoryId } = useParams();
  useEffect(() => {
    getCategory(categoryId);
  }, [getCategory, categoryId]);

  return (
    <section className='container'>
      {category === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-tag'></i> Category
          </h1>
          <Link to='/categories' className='btn btn-light'>
            Back to Categories
          </Link>
          {auth.isAuthenticated && auth.loading === false && (
            <Link
              to={`/categories/edit/${categoryId}`}
              className='btn btn-dark'
            >
              Edit Category
            </Link>
          )}
          <div className='category-grid py-2'>
            <CategoryItem category={category} />
          </div>
        </Fragment>
      )}
    </section>
  );
};

Category.propTypes = {
  getCategory: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  category: state.category,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCategory })(Category);
