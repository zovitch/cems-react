import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createInvestment,
  getInvestment,
  deleteInvestment,
} from '../../actions/investment';
import ToggleSwitch from '../layout/ToggleSwitch';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our investmentData
 */

const initialState = {
  year: '',
  number: '',
  name: '',
  estimatedUnitPrice: '',
  quantity: 1,
  approved: false,
  completed: false,
};

const InvestmentForm = ({
  getInvestment,
  createInvestment,
  deleteInvestment,
  investment: { investment },
  auth: { user },
}) => {
  const [formData, setFormData] = useState(initialState);
  const [toggleApprovedOn, setToggleApprovedOn] = useState();
  const [toggleCompletedOn, setToggleCompletedOn] = useState();
  const navigate = useNavigate();
  const { investmentId } = useParams();
  let creatingInvestment = true;
  if (investmentId) creatingInvestment = false;

  useEffect(() => {
    !investment && investmentId && getInvestment(investmentId);

    if (investment && !investment.loading) {
      const investmentData = { ...initialState };
      for (const key in investment) {
        if (key in investmentData) investmentData[key] = investment[key];
      }
      setFormData(investmentData);
      setToggleApprovedOn(investmentData.approved);
      setToggleCompletedOn(investmentData.completed);
    }
  }, [getInvestment, investment, investmentId]);

  const onChange = (e) => {
    e.target.type === 'checkbox' &&
      (e.target.value = Boolean(e.target.checked));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createInvestment(formData, navigate, creatingInvestment, investmentId);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        <i className='fas fa-sack-dollar'></i>{' '}
        {creatingInvestment ? 'Create a new Investment' : 'Edit Investment'}
      </h1>
      <form className='form py' onSubmit={onSubmit}>
        <div className='form-group'>
          <small className='form-text'>Year</small>
          <input
            type='text'
            placeholder={`⎵⎵⎵⎵`}
            name='year'
            value={formData.year}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Number</small>
          <input
            type='text'
            placeholder={`⎵⎵`}
            name='number'
            value={formData.number}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder='Name of the Investment'
            name='name'
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Estimated Unit Price</small>
          <input
            type='text'
            placeholder='Estimated Unit Price in Chinese Yuan'
            name='estimatedUnitPrice'
            value={formData.estimatedUnitPrice}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Quantity</small>
          <input
            type='text'
            placeholder={`1`}
            name='quantity'
            value={formData.quantity}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Approved</small>
          <ToggleSwitch
            name='approved'
            id='approved'
            defaultChecked={toggleApprovedOn}
            onClick={onChange}
          />
        </div>
        <div className='form-group'>
          <small className='form-text'>Completed</small>
          <ToggleSwitch
            name='completed'
            id='completed'
            defaultChecked={toggleCompletedOn}
            onClick={onChange}
          />
        </div>
        <input type='submit' value='Save' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/investments'>
          Go Back
        </Link>
      </form>
      {creatingInvestment === false && user.isAdmin && (
        <>
          <div className='line' />
          <div className='my-2 text-center'>
            <button
              className='btn btn-danger'
              onClick={() => deleteInvestment(investmentId, navigate)}
            >
              <i className='fas fa-trash' /> Delete the Investment
            </button>
          </div>
        </>
      )}
    </section>
  );
};

InvestmentForm.propTypes = {
  investment: PropTypes.object.isRequired,
  createInvestment: PropTypes.func.isRequired,
  getInvestment: PropTypes.func.isRequired,
  deleteInvestment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  investment: state.investment,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createInvestment,
  getInvestment,
  deleteInvestment,
})(InvestmentForm);
