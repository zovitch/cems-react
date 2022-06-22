import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getR3 } from '../../actions/r3';
import Spinner from '../layout/Spinner';
import R3Item from '../r3s/R3Item';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';

const R3 = ({ getR3, r3: { r3 }, auth }) => {
  const { r3Id } = useParams();

  useEffect(() => {
    getR3(r3Id);
  }, [getR3, r3Id]);

  return (
    <section className='container'>
      {r3 === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='r3' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-screwdriver'></i> R3
              </div>
              <R3Item r3={r3} />
            </div>
            {/* <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-clipboard-list'></i> Show some stuff here
                @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div> */}
          </div>
        </Fragment>
      )}
    </section>
  );
};

R3.propTypes = {
  getR3: PropTypes.func.isRequired,
  r3: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  auth: state.auth,
});
export default connect(mapStateToProps, { getR3 })(R3);
