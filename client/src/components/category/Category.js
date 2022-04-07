import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getCategory } from '../../actions/category';
import CategoryItem from '../categories/CategoryItem';
import { useParams } from 'react-router-dom';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
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
          <PageTitleBarSingleView item='category' />

          <div className='viewPage-25-75 py-2'>
            <div className='view-25'>
              <div className='lead'>
                <i className='fas fa-tag'></i> Category
              </div>
              <CategoryItem category={category} />
            </div>
            <div className='view-75'>
              <div className='lead'>
                <i className='fas fa-question'></i> Some Other stuff @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div>
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
