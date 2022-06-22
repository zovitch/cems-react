import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getCode } from '../../actions/code';
import CodeItem from '../codes/CodeItem';
import { useParams } from 'react-router-dom';
import PageTitleBarSingleViewAdmin from '../layout/PageTitleBarSingleViewAdmin';
import { connect } from 'react-redux';

const Code = ({ getCode, code, codetype }) => {
  const { codeId } = useParams();

  useEffect(() => {
    getCode(codeId, codetype);
  }, [getCode, codeId, codetype]);
  return (
    <section className='container'>
      {code.code === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleViewAdmin item={codetype + `code`} />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-tag'></i> Code
              </div>
              <CodeItem code={code.code} />
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

Code.propTypes = {
  getCode: PropTypes.func.isRequired,
  code: PropTypes.object.isRequired,
  codetype: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  code: state.code,
});

export default connect(mapStateToProps, { getCode })(Code);
