import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const R3Item = ({
  r3: {
    _id,
    r3Number,
    machine,
    r3Date,
    applicant,
    failureCode,
    failureExplanation,
    failureExplanationCN,
    machineStopped,
    repairEngineer,
    repairCode,
    repairExplanation,
    repairExplanationCN,
    engineeringRemark,
    analysisCode,
    analysisExplanation,
    analysisExplanationCN,
    maintenanceOilWaste,
    maintenancePlasticAndMetalWaste,
    maintenanceSpareParts,
    engineeringRepairDate,
    applicantValidationDate,
    remark,
  },
}) => {
  return (
    <div className='r3-card card-nohover bg-white'>
      <h2 className='r3-r3Number'>{r3Number}</h2>
      <h3 className='r3-qualityNumber'>{machine && machine.machineNumber}</h3>
      <div className='r3-spacer1'></div>
      <div className='r3-designationCN'>{machine && machine.designation}</div>
      <div className='r3-designation'>{machine && machine.designationCN}</div>

      <div className='r3-designation'>{r3Date && formatDate(r3Date)}</div>
      <div className='r3-designation'>{applicant}</div>
      <div className='r3-designation'>
        {failureCode && String(failureCode.codeNumber).padStart(2, '0')} -{' '}
        {failureCode && failureCode.name}
      </div>
      <div className='r3-designation'>{failureExplanation}</div>
      <div className='r3-designation'>{failureExplanationCN}</div>
      <div className='r3-designation'>
        {machineStopped && <i className='fas fa-stop-circle fa-center'></i>}
      </div>
      <div className='r3-designation'>
        {repairEngineer && repairEngineer.name}
      </div>
      <div className='r3-designation'>
        {repairCode && String(repairCode.codeNumber).padStart(2, '0')}
      </div>
      <div className='r3-designation'>{repairExplanation}</div>
      <div className='r3-designation'>{repairExplanationCN}</div>
      <div className='r3-designation'>{engineeringRemark}</div>
      <div className='r3-designation'>
        {repairCode && String(analysisCode.codeNumber).padStart(2, '0')}
      </div>
      <div className='r3-designation'>{analysisExplanation}</div>
      <div className='r3-designation'>{analysisExplanationCN}</div>
      <div className='r3-designation'>{maintenanceOilWaste}</div>
      <div className='r3-designation'>{maintenancePlasticAndMetalWaste}</div>
      <div className='r3-designation'>{maintenanceSpareParts}</div>
      <div className='r3-designation'>
        {engineeringRepairDate && formatDate(engineeringRepairDate)}
      </div>
      <div className='r3-designation'>{applicantValidationDate}</div>
      <div className='r3-designation'>{remark}</div>
    </div>
  );
};

R3Item.propTypes = {
  r3: PropTypes.object.isRequired,
};

export default R3Item;
