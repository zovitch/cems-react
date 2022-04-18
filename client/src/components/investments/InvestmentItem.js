import React from 'react';
import PropTypes from 'prop-types';

const InvestmentItem = ({
  investment: {
    investmentNumber,
    name,
    estimatedUnitPrice,
    quantity,
    approved,
    completed,
  },
}) => {
  return (
    <div className='investment-card card-nohover bg-white'>
      <h2 className='investment-investmentnumber'>{investmentNumber}</h2>

      <div className='investment-name'>{name}</div>

      {estimatedUnitPrice && (
        <small className='investment-price-label'>Unit Price</small>
      )}
      <div className='investment-price'>{estimatedUnitPrice}</div>

      {quantity && (
        <small className='investment-quantity-label'>Quantity</small>
      )}
      {quantity && <div className='investment-quantity'> {quantity}</div>}

      <small className='investment-approved-label'>Approved</small>
      {approved && (
        <div className='investment-approved'>
          {approved === true && <i className='fas fa-check'></i>}
        </div>
      )}

      <small className='investment-completed-label'>Completed</small>
      {completed && (
        <div className='investment-completed'>
          {completed === true && <i className='fas fa-check'></i>}
        </div>
      )}
    </div>
  );
};

InvestmentItem.propTypes = {
  investment: PropTypes.object.isRequired,
};

export default InvestmentItem;
