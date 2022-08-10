import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBarEngineer from '../layout/PageTitleBarEngineer';
import { getInvestments } from '../../actions/investment';
import { Link } from 'react-router-dom';

const Investments = ({
  getInvestments,
  auth,
  investment: { investments, loading },
}) => {
  useEffect(() => {
    getInvestments();
  }, [getInvestments]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarEngineer item='investment' faIcon='fas fa-sack-dollar' />
          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-investment'>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Investment No.</div>
              <div className='attribute'>Name</div>
              <div className='attribute'>Est. Unit Price</div>
              <div className='attribute'>Qty</div>
              <div className='attribute'>Approved</div>
              <div className='attribute'>Completed</div>
            </li>

            {/* The rest of the items in the list are the actual data */}
            {investments &&
              investments.length > 0 &&
              investments.map((investment) => (
                <li
                  key={investment._id}
                  className='item item-container item-container-investment'
                >
                  <div className='attribute' data-name='Open'>
                    <Link to={`/investments/${investment._id}`}>
                      <i className='fas fa-eye'></i>
                    </Link>
                  </div>
                  <div className='attribute hide-sm' data-name='Edit'>
                    {auth && auth.isAuthenticated && auth.user.isEngineer && (
                      <Link to={`/investments/edit/${investment._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>

                  <div className='attribute' data-name='Investment No.'>
                    {investment.investmentNumber}
                  </div>
                  <div className='attribute' data-name='Name'>
                    {investment.name}
                  </div>
                  <div
                    className='attribute hide-sm'
                    data-name='Est. Unit Price'
                  >
                    {investment.estimatedUnitPrice}
                  </div>
                  <div className='attribute hide-sm' data-name='Qty'>
                    {investment.quantity}
                  </div>
                  <div className='attribute hide-sm' data-name='Approved'>
                    {investment.approved === true && (
                      <i className='fas fa-check fa-center'></i>
                    )}
                  </div>
                  <div className='attribute' data-name='Completed'>
                    {investment.completed === true && (
                      <i className='fas fa-check fa-center'></i>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </section>
  );
};

Investments.propTypes = {
  getInvestments: PropTypes.func.isRequired,
  investment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  investment: state.investment,
  auth: state.auth,
});

export default connect(mapStateToProps, { getInvestments })(Investments);
