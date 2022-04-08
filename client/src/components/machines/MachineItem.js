import React from 'react';
import PropTypes from 'prop-types';
import nth from '../../utils/nth';

const MachineItem = ({
  machine: {
    _id,
    machineNumber,
    qualityNumber,
    designation,
    designationCN,
    category,
    department,
    manufacturer,
    model,
    serialNumber,
    manufacturingDate,
    acquiredDate,
    investmentNumber,
    costCenter,
    purchasedPrice,
    comment,
    afa,
    parentMachine,
  },
}) => {
  return (
    <div className='machine-card card-nohover bg-white'>
      <h2 className='machine-machineNumber'>{machineNumber}</h2>
      <h3 className='machine-qualityNumber'>{qualityNumber}</h3>
      <div className='machine-designationCN'>{designationCN}</div>
      <div className='machine-designation'>{designation}</div>

      {afa && afa.afaNumber && (
        <div className='machine-afa'>
          AFA {String(afa.afaNumber).padStart(4, '0')}
        </div>
      )}

      {category && category.code && category.trigram && (
        <div className='machine-category'>
          {category.code} - {category.trigram}
        </div>
      )}

      {department && (
        <div className='machine-department'>{department.name}</div>
      )}
      {department && department.location && department.location.floor && (
        <div className='machine-location'>
          {nth(department.location.floor)} Floor (
          {department.location.locationLetter})
        </div>
      )}

      {manufacturer && (
        <div>
          <small className='machine-manufacturer-label'>Manufacturer </small>
          <div className='machine-manufacturer-value'>{manufacturer} </div>
        </div>
      )}

      {model && <small className='machine-model-label'>Model </small>}
      {model && <div className='machine-model-value'>{model} </div>}

      {serialNumber && <small className='machine-label'>s/n </small>}
      {serialNumber && <div className='machine-value'>{serialNumber} </div>}

      {manufacturingDate && (
        <small className='machine-manuDate-label'>Manufactured </small>
      )}
      {manufacturingDate && (
        <div className='machine-manuDate-value'> {manufacturingDate} </div>
      )}

      {acquiredDate && (
        <small className='machine-acquDate-label'>acquiredDate </small>
      )}
      {acquiredDate && (
        <div className='machine-acquDate-value'>{acquiredDate} </div>
      )}

      {investmentNumber && (
        <small className='machine-investment-label'>investmentNumber </small>
      )}
      {investmentNumber && (
        <div className='machine-investment-value'>{investmentNumber} </div>
      )}

      {costCenter && (
        <small className='machine-costCenter-label'>costCenter </small>
      )}
      {costCenter && (
        <div className='machine-costCenter-value'>{costCenter} </div>
      )}

      {purchasedPrice && (
        <small className='machine-price-label'>purchasedPrice </small>
      )}
      {purchasedPrice && (
        <div className='machine-price-value'>{purchasedPrice} </div>
      )}

      {comment && <div className='machine-comment'>{comment}</div>}
    </div>
  );
};

MachineItem.propTypes = {
  machine: PropTypes.object.isRequired,
};

export default MachineItem;
