import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

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
  const { machineId } = useParams();

  return (
    <div className='machines-grid-item bg-white'>
      <div className='machine-machineNumber'>{machineNumber}</div>

      {machineId !== _id && (
        <div className='card-button-more'>
          <Link to={`/machines/${_id}`}>
            <i className='fa-solid fa-angles-right'></i>
          </Link>
        </div>
      )}
    </div>
  );
};

MachineItem.propTypes = {
  machine: PropTypes.object.isRequired,
};

export default MachineItem;
