import React from 'react';
import PropTypes from 'prop-types';
import nth from '../../utils/nth';
import formatDate from '../../utils/formatDate';

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
    investment,
    costCenter,
    purchasedPrice,
    comment,
    afa,
    imgPath,
    parentMachine,
  },
}) => {
  return (
    <div className='machine-card card-nohover bg-white'>
      <h2 className='machine-machineNumber'>{machineNumber}</h2>
      <h3 className='machine-qualityNumber'>{qualityNumber}</h3>
      <div className='machine-spacer1'></div>
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

      {manufacturer && manufacturer.name && (
        <small className='machine-manufacturer-label'>Manufacturer </small>
      )}
      {manufacturer && manufacturer.name && (
        <div className='machine-manufacturer-value'>{manufacturer.name} </div>
      )}

      {manufacturer && manufacturer.nameCN && (
        <small className='machine-manufacturerCN-label'>制造商 </small>
      )}
      {manufacturer && manufacturer.nameCN && (
        <div className='machine-manufacturerCN-value'>
          {manufacturer.nameCN}
        </div>
      )}

      <div className='machine-spacer2'></div>

      {model && <small className='machine-model-label'>Model </small>}
      {model && <div className='machine-model-value'>{model} </div>}

      {serialNumber && <small className='machine-sn-label'>s/n </small>}
      {serialNumber && <div className='machine-sn-value'>{serialNumber} </div>}

      {manufacturingDate && (
        <small className='machine-manuDate-label'>Manufactured </small>
      )}
      {manufacturingDate && (
        <div className='machine-manuDate-value'>
          {' '}
          {formatDate(manufacturingDate)}{' '}
        </div>
      )}

      {acquiredDate && (
        <small className='machine-acquDate-label'>Acquired </small>
      )}
      {acquiredDate && (
        <div className='machine-acquDate-value'>{formatDate(acquiredDate)}</div>
      )}

      {investment && investment.investmentNumber && (
        <small className='machine-investment-label'>Investment No. </small>
      )}
      {investment && investment.investmentNumber && (
        <div className='machine-investment-value'>
          {investment.investmentNumber}
        </div>
      )}

      {costCenter && (
        <small className='machine-costCenter-label'>Cost Center </small>
      )}
      {costCenter && (
        <div className='machine-costCenter-value'>{costCenter} </div>
      )}

      {purchasedPrice && (
        <small className='machine-price-label'>Purchased Price </small>
      )}
      {purchasedPrice && (
        <div className='machine-price-value'>{purchasedPrice} </div>
      )}

      {comment && <div className='machine-comment'>{comment}</div>}

      {imgPath && (
        <div className='machine-img'>
          <img type='image' src={imgPath} alt={imgPath} />
        </div>
      )}
    </div>
  );
};

MachineItem.propTypes = {
  machine: PropTypes.object.isRequired,
};

export default MachineItem;
