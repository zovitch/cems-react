import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getFailureCodes } from '../../actions/code';
import CodeItem from './CodeItem';

const Codes = ({ getFailureCodes, auth, failureCode }) => {
  useEffect(() => {
    getFailureCodes();
  }, [getFailureCodes]);
  return (
    <section className='container'>
      {failureCode.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-failure'>
            <i className='fas fa-code'> </i> Failure Codes
          </h1>

          <div className='codes my-2'>
            {failureCode.codes && failureCode.codes.length > 0 ? (
              failureCode.codes.map((code) => (
                <CodeItem key={code._id} code={code} />
              ))
            ) : (
              <h4>No Code found</h4>
            )}
          </div>
          {auth && auth.isAuthenticated && auth.loading === false && (
            <AddNew item='code' />
          )}
        </Fragment>
      )}
    </section>
  );
};

Codes.propTypes = {
  getFailureCodes: PropTypes.func.isRequired,
  failureCode: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  failureCode: state.failureCode,
  auth: state.auth,
});

export default connect(mapStateToProps, { getFailureCodes })(Codes);
