import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getCodes } from '../../actions/code';
import CodeItem from './CodeItem';

const Codes = ({
  getCodes,
  auth,
  failureCode,
  repairCode,
  analysisCode,
  codetype,
}) => {
  useEffect(() => {
    getCodes(codetype);
  }, [codetype, getCodes]);

  let codeFunction;
  switch (codetype) {
    case 'failure':
      codeFunction = failureCode;
      break;
    case 'repair':
      codeFunction = repairCode;
      break;
    case 'analysis':
      codeFunction = analysisCode;
      break;
    default:
      codeFunction = repairCode;
      break;
  }

  return (
    <section className='container'>
      {codeFunction.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className={`large text-${codetype}`}>
            <i className='fas fa-code'> </i>{' '}
            {codetype[0].toUpperCase() + codetype.substring(1)} Codes
          </h1>

          <div className='codes my-2'>
            {codeFunction.codes && codeFunction.codes.length > 0 ? (
              codeFunction.codes.map((code) => (
                <CodeItem key={code._id} ctype={codetype} code={code} />
              ))
            ) : (
              <h4>No Code found</h4>
            )}
          </div>
          {auth && auth.isAuthenticated && auth.loading === false && (
            <AddNew item={`${codetype}code`} />
          )}
        </Fragment>
      )}
    </section>
  );
};

Codes.propTypes = {
  failureCode: PropTypes.object.isRequired,
  repairCode: PropTypes.object.isRequired,
  analysisCode: PropTypes.object.isRequired,
  getCodes: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  failureCode: state.failureCode,
  repairCode: state.repairCode,
  analysisCode: state.analysisCode,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCodes })(Codes);
