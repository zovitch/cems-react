import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getInvestment } from '../../actions/investment';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import InvestmentItem from '../investments/InvestmentItem';

const Investment = ({ getInvestment, investment: { investment }, auth }) => {
  const { investmentId } = useParams();

  useEffect(() => {
    getInvestment(investmentId);
  }, [getInvestment, investmentId]);

  return (
    <section className='container'>
      {investment === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='investment' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-sack-dollar'></i> Investment
              </div>
              <InvestmentItem investment={investment} />
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

Investment.propTypes = {
  getInvestment: PropTypes.func.isRequired,
  investment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  investment: state.investment,
  auth: state.auth,
});

export default connect(mapStateToProps, { getInvestment })(Investment);
