import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getManufacturer } from '../../actions/manufacturer';
import ManufacturerItem from '../manufacturers/ManufacturerItem';

const Manufacturer = ({
  getManufacturer,
  manufacturer: { manufacturer },
  auth,
}) => {
  const { manufacturerId } = useParams();
  useEffect(() => {
    getManufacturer(manufacturerId);
  }, [getManufacturer, manufacturerId]);

  return (
    <section className='container'>
      {manufacturer === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-industry'></i> Manufacturer 制造商
          </h1>
          <Link to='/manufacturers' className='btn btn-light'>
            Back to Manufacturers
          </Link>
          {auth.isAuthenticated && auth.loading === false && (
            <Link
              to={`/manufacturers/edit/${manufacturerId}`}
              className='btn btn-dark'
            >
              Edit Manufacturer
            </Link>
          )}
          <div className='manufacturer-grid py-2'>
            <ManufacturerItem manufacturer={manufacturer} />
          </div>
        </Fragment>
      )}
    </section>
  );
};

Manufacturer.propTypes = {
  getManufacturer: PropTypes.func.isRequired,
  manufacturer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  manufacturer: state.manufacturer,
  auth: state.auth,
});

export default connect(mapStateToProps, { getManufacturer })(Manufacturer);
