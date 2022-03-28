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
          <div className='pageHeader'>
            <h1 className='large text-primary pageTitle'>
              <i className='fas fa-tags'> </i> Categories
            </h1>
            <div className='pageActions'>
              {auth && auth.isAuthenticated && auth.loading === false && (
                <AddNew item='category' />
              )}
            </div>
          </div>

          <ol className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-5'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Code</div>
              <div className='attribute'>Trigram</div>
              <div className='attribute'>Designation</div>
              <div className='attribute'>设备名称</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category._id}
                  className='item item-container item-container-5'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/categories/edit/${category._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Code'>
                    {category.code}
                  </div>
                  <div className='attribute' data-name='Trigram'>
                    {category.trigram}
                  </div>
                  <div className='attribute' data-name='Designation'>
                    {category.description}
                  </div>
                  <div className='attribute' data-name='设备名称'>
                    {category.descriptionCN}
                  </div>
                </li>
              ))
            ) : (
              <h4>No category found</h4>
            )}
          </ol>
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
