import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getCodes } from '../../actions/code';

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
          <PageTitleBar item={`${codetype}code`} faIcon='fas fa-code' />

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-5 '>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Code</div>
              <div className='attribute'>Name</div>
              <div className='attribute'>Designation</div>
              <div className='attribute'>设备名称</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {codeFunction.codes &&
              codeFunction.codes.length > 0 &&
              codeFunction.codes.map((code) => (
                <li
                  key={code._id}
                  className='item item-container item-container-5'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/${codetype}codes/edit/${code._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Code'>
                    {code.codeNumber}
                  </div>
                  <div className='attribute' data-name='Name'>
                    {code.name}
                  </div>
                  <div className='attribute' data-name='Designation'>
                    {code.description}
                  </div>
                  <div className='attribute' data-name='设备名称'>
                    {code.descriptionCN}
                  </div>
                </li>
              ))}
          </ul>
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
