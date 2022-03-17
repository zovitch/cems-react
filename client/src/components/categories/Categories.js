import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getCategories } from '../../actions/category';
import CategoryItem from './CategoryItem';
import { Link } from 'react-router-dom';
import CategoryForm from '../category-form/CategoryForm';
import { AddNew } from '../layout/AddNew';

const Categories = ({
  getCategories,
  auth,
  category: { categories, loading },
}) => {
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-tags'> </i> Categories
          </h1>

          <div className='categories py-1'>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <CategoryItem key={category._id} category={category} />
              ))
            ) : (
              <h4>No Category found</h4>
            )}
            {auth && auth.isAuthenticated && auth.loading === false && (
              <AddNew item='category' />
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Categories.propTypes = {
  getCategories: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  category: state.category,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCategories })(Categories);
