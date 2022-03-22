import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getManufacturers } from '../../actions/manufacturer';
import ManufacturerItem from './ManufacturerItem';

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
          <h1 className='large text-primary'>
            <i className='fas fa-industry'> </i> Manufacturers 制造商
          </h1>

          <div className='manufacturers my-2'>
            {manufacturers && manufacturers.length > 0 ? (
              manufacturers.map((manufacturer) => (
                <ManufacturerItem
                  key={manufacturer._id}
                  manufacturer={manufacturer}
                />
              ))
            ) : (
              <h4>No Manufacturer found</h4>
            )}
          </div>
          {auth && auth.isAuthenticated && auth.loading === false && (
            <AddNew item='manufacturer' />
          )}
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
