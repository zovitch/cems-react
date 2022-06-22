import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getManufacturer } from '../../actions/manufacturer';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
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
          <PageTitleBarSingleView item='manufacturer' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-industry'></i> Manufacturer
              </div>
              <ManufacturerItem manufacturer={manufacturer} />
            </div>
            {/* <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-question'></i> Some Other stuff @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div> */}
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
