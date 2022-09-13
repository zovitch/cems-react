import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';
import Avatar from 'react-avatar';

const TechnicalSupportItem = ({ technicalsupport }) => {
  return (
    <div className='technicalsupport-card card-nohover bg-white'>
      <h2 className='technicalsupport-name'>
        {technicalsupport.applicationDate &&
          formatDate(technicalsupport.applicationDate)}
      </h2>
      <h2 className='technicalsupport-nameCN'>
        {technicalsupport.applicant && (
          <>
            <Avatar
              name={technicalsupport.applicant.name}
              round={true}
              size='22px'
            />{' '}
            {technicalsupport.applicant.name}{' '}
            {technicalsupport.applicantValidation ? (
              <i className='fa-solid fa-xs fa-circle-check text-success'></i>
            ) : (
              <i className='fa-solid fa-xs fa-circle-xmark text-danger'></i>
            )}
          </>
        )}
      </h2>
      <div className='grid-1fr3fr'>
        <small>Expected Date</small>
        {technicalsupport.expectedDate &&
          formatDate(technicalsupport.expectedDate)}
      </div>

      <div className='grid-1fr3fr'>
        <small>Description</small>
        {technicalsupport.description}
      </div>

      <div className='grid-1fr3fr'>
        <small>Requirement</small>
        {technicalsupport.requirement}
      </div>

      <div className='grid-1fr3fr'>
        <small>reason</small>
        {technicalsupport.reason}
      </div>

      <br />

      <div className='grid-1fr3fr'>
        <small>Order Taker</small>

        {technicalsupport.orderTaker && (
          <>
            <Avatar
              name={technicalsupport.orderTaker.name}
              round={true}
              size='22px'
            />{' '}
            {technicalsupport.orderTaker.name}
          </>
        )}
      </div>
      <div className='grid-1fr3fr'>
        <small>Opinion</small>
        {technicalsupport.engineeringOpinion}
      </div>
      <div className='grid-1fr3fr'>
        <small>Projected Time</small>
        {technicalsupport.projectedTime}
      </div>

      <div className='grid-1fr3fr'>
        <small>Progress </small>
        {technicalsupport.progress}
      </div>

      <br />
      <div className='grid-1fr3fr'>
        <small>Completion Date</small>
        {technicalsupport.completionDate &&
          formatDate(technicalsupport.completionDate)}
      </div>
    </div>
  );
};

TechnicalSupportItem.propTypes = {
  technicalsupport: PropTypes.object.isRequired,
};

export default TechnicalSupportItem;
