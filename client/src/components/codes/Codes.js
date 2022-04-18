import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getCodes } from '../../actions/code';

const Codes = ({ getCodes, auth, code, codetype }) => {
  useEffect(() => {
    getCodes(codetype);
  }, [codetype, getCodes]);

  let codeFunction;
  switch (codetype) {
    case 'failure':
      codeFunction = code.failureCodes;
      break;
    case 'repair':
      codeFunction = code.repairCodes;
      break;
    case 'analysis':
      codeFunction = code.analysisCodes;
      break;
    default:
      codeFunction = code.repairCodes;
      break;
  }

  return (
    <section className='container'>
      {code.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar item={`${codetype}code`} faIcon='fas fa-code' />

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-6 '>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Code</div>
              <div className='attribute'>Name</div>
              <div className='attribute'>Designation</div>
              <div className='attribute'>设备名称</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {codeFunction &&
              codeFunction.length > 0 &&
              codeFunction.map((code) => (
                <li
                  key={code._id}
                  className='item item-container item-container-6'
                >
                  <div className='attribute' data-name='Open'>
                    <Link to={`/${codetype}codes/${code._id}`}>
                      <i className='fas fa-eye'></i>
                    </Link>
                  </div>
                  <div className='attribute' data-name='Edit'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/${codetype}codes/edit/${code._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Code'>
                    {String(code.codeNumber).padStart(2, '0')}
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
  code: PropTypes.object.isRequired,
  getCodes: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  code: state.code,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCodes })(Codes);
