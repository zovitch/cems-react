import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getCategories } from '../../actions/category';
import { Link } from 'react-router-dom';
import PageTitleBarAdmin from '../layout/PageTitleBarAdmin';

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
          <PageTitleBarAdmin item='category' faIcon='fas fa-tags' />

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-categories'>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute hide-sm'>Code</div>
              <div className='attribute'>Trigram</div>
              <div className='attribute'>Designation</div>
              <div className='attribute'>设备名称</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {categories &&
              categories.length > 0 &&
              categories.map((category) => (
                <li
                  key={category._id}
                  className='item item-container item-container-categories'
                >
                  <div className='attribute' data-name='Open'>
                    <Link to={`/categories/${category._id}`}>
                      <i className='fas fa-eye'></i>
                    </Link>
                  </div>
                  <div className='attribute hide-sm' data-name='Edit'>
                    {auth && auth.isAuthenticated && auth.user.isAdmin && (
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
              ))}
          </ul>
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
