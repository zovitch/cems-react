import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getCode } from '../../actions/code';
import CodeItem from '../codes/CodeItem';
import { useParams } from 'react-router-dom';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import { connect } from 'react-redux';

const Code = ({ getCode, code: { code }, codetype, auth }) => {
  const { codeId } = useParams();

  useEffect(() => {
    getCode(codeId, codetype);
  }, [getCode, codeId, codetype]);
  return (
    <section className='container'>
      {code === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item={codetype + `code`} />

          <div className='viewPage-25-75 py-2'>
            <div className='view-25'>
              <div className='lead'>
                <i className='fas fa-tag'></i> Code
              </div>
              <CodeItem code={code} />
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
  code: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  code: state.code,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCode })(Code);
