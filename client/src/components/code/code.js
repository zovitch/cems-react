import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getCode } from '../../actions/code';
import CodeItem from '../codes/CodeItem';
import { useParams } from 'react-router-dom';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import { connect } from 'react-redux';

const Code = ({ getCode, failureCode, repairCode, analysisCode, codetype }) => {
  const { codeId } = useParams();

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

  useEffect(() => {
    getCode(codeId, codetype);
  }, [getCode, codeId, codetype]);
  return (
    <section className='container'>
      {codeFunction.code === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item={codetype + `code`} />

          <div className='viewPage-25-75 py-2'>
            <div className='view-25'>
              <div className='lead'>
                <i className='fas fa-tag'></i> Code
              </div>
              <CodeItem code={codeFunction.code} />
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

Code.propTypes = {
  getCode: PropTypes.func.isRequired,
  failureCode: PropTypes.object.isRequired,
  repairCode: PropTypes.object.isRequired,
  analysisCode: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  failureCode: state.failureCode,
  repairCode: state.repairCode,
  analysisCode: state.analysisCode,
});

export default connect(mapStateToProps, { getCode })(Code);
