import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getTechnicalSupport } from '../../actions/technicalsupport';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import TechnicalSupportItem from '../technicalsupports/TechnicalSupportItem';

const Technicalsupport = ({
  getTechnicalSupport,
  technicalsupport: { technicalsupport },
  auth,
}) => {
  const { technicalsupportId } = useParams();

  useEffect(() => {
    getTechnicalSupport(technicalsupportId);
  }, [getTechnicalSupport, technicalsupportId]);

  return (
    <section className='container'>
      {technicalsupport === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='technicalsupport' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-handshake-angle'></i> Technical Support
              </div>
              <TechnicalSupportItem technicalsupport={technicalsupport} />
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

Technicalsupport.propTypes = {
  getTechnicalSupport: PropTypes.func.isRequired,
  technicalsupport: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  technicalsupport: state.technicalsupport,
  auth: state.auth,
});

export default connect(mapStateToProps, { getTechnicalSupport })(
  Technicalsupport,
);
