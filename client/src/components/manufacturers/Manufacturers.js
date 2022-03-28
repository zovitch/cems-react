import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getManufacturers } from '../../actions/manufacturer';

const Manufacturers = ({
  getManufacturers,
  auth,
  manufacturer: { manufacturers, loading },
}) => {
  useEffect(() => {
    getManufacturers();
  }, [getManufacturers]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='pageHeader'>
            <h1 className='large text-primary pageTitle'>
              <i className='fas fa-industry'> </i> Manufacturers
              <span className='hide-sm'> 制造商</span>
            </h1>
            <div className='pageActions'>
              {auth && auth.isAuthenticated && auth.loading === false && (
                <AddNew item='manufacturer' />
              )}
            </div>
          </div>

          <ol className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-3'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Manufacturer</div>
              <div className='attribute'>制造商</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {manufacturers && manufacturers.length > 0 ? (
              manufacturers.map((manufacturer) => (
                <li
                  key={manufacturer._id}
                  className='item item-container item-container-3'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/manufacturers/edit/${manufacturer._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Manufacturer'>
                    {manufacturer.name}
                  </div>
                  <div className='attribute' data-name='制造商'>
                    {manufacturer.nameCN}
                  </div>
                </li>
              ))
            ) : (
              <h4>No Manufacturer found</h4>
            )}
          </ol>
        </Fragment>
      )}
    </section>
  );
};

Manufacturers.propTypes = {
  getManufacturers: PropTypes.func.isRequired,
  manufacturer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  manufacturer: state.manufacturer,
  auth: state.auth,
});

export default connect(mapStateToProps, { getManufacturers })(Manufacturers);
