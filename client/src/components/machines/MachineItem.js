import React from 'react';
import PropTypes from 'prop-types';

const MachineItem = ({
  machine: {
    _id,
    machineNumber,
    qualityNumber,
    designation,
    designationCN,
    afa,
    category,
    manufacturer,
    department,
    model,
    serialNumber,
    manufacturingDate,
    acquiredDate,
    investmentNumber,
    costCenter,
    purchasedPrice,
    comment,
    parentMachine,
  },
}) => {
  return (
    <div className='machine-card card-nohover bg-white'>
      <div className='machine-machineNumber'>{machineNumber}</div>
    </div>
  );
};

MachineItem.propTypes = {
  machine: PropTypes.object.isRequired,
};

export default MachineItem;
