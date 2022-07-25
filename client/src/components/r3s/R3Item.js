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
    r3Completed,
    remark,
  },
}) => {
  return (
    <div className='r3Card p-2'>
      <div className='grid-1fr3fr'>
        <small>
          R3 No.
          {r3Completed ? (
            <i className='fa-solid fa-circle-check text-success'></i>
          ) : (
            <i className='fa-solid fa-circle-xmark text-danger'></i>
          )}
        </small>
        <span>
          <h3 className='text-danger'>{r3Number}</h3>
          <small>{remark}</small>
        </span>
      </div>
      <div className='grid-1fr3fr'>
        <small>EQU No.</small>
        <span>
          <h3 className='text-failure'>{machine && machine.machineNumber}</h3>
        </span>
      </div>
      <div className='grid-1fr3fr'>
        <small>设备名称</small>
        <h3>{machine && machine.designationCN}</h3>
      </div>
      <div className='grid-1fr3fr'>
        <small>Designation</small>
        <h3>{machine && machine.designation}</h3>
      </div>
      <br />
      <div className='grid-1fr3fr'>
        <small>R3 Date</small>
        <span className='grid-1fr2fr'>
          <h4>{r3Date && formatDate(r3Date)}</h4>
          <small>Machine Stopped?</small>
        </span>
      </div>
      <div className='r3-designation'></div>
      <div className='grid-1fr3fr'>
        <small>报修人员 Applicant</small>
        <div className='grid-1fr2fr'>
          <h4>{applicant}</h4>
          <h4>{machineStopped ? 'Yes' : 'No'}</h4>
        </div>
      </div>
      <br />
      <div className='grid-1fr3fr'>
        <small>Repair Engineer</small>
        <h4>{repairEngineer ? repairEngineer.name : '/'}</h4>
      </div>
      <div className='grid-1fr3fr'>
        <small>Engineer Remark</small>
        <h4>{engineeringRemark ? engineeringRemark : '/'}</h4>
      </div>

      <div className='r3-designation'>{engineeringRemark}</div>

      <hr className='my-1' />
      <div className='grid-1fr3fr'>
        <small>Failure Code</small>
        <span></span>
        <span className='text-failure'>
          <h3>
            {failureCode && String(failureCode.codeNumber).padStart(2, '0')}
          </h3>
          {failureCode && failureCode.name}
        </span>
        <span>
          <h4>{failureCode ? failureCode.descriptionCN : '/'}</h4>
          <h4>{failureCode ? failureCode.description : '/'}</h4>
        </span>
      </div>
      <br />
      <div>{failureExplanationCN}</div>
      <div>{failureExplanation}</div>
      {repairCode && (
        <>
          <hr className='my-1' />
          <div className='grid-1fr3fr'>
            <small>Repair Code</small>
            <span></span>
            <span className='text-repair'>
              <h3>
                {repairCode && String(repairCode.codeNumber).padStart(2, '0')}
              </h3>
              {repairCode && repairCode.name}
            </span>
            <span>
              <h4>{repairCode && repairCode.descriptionCN}</h4>
              <h4>{repairCode && repairCode.description}</h4>
            </span>
          </div>
          <br />
          <div>{repairExplanationCN}</div>
          <div>{repairExplanation}</div>
        </>
      )}
      {analysisCode && (
        <>
          <hr className='my-1' />
          <div className='grid-1fr3fr'>
            <small>Analysis Code</small>
            <span></span>
            <span className='text-analysis'>
              <h3>
                {analysisCode &&
                  String(analysisCode.codeNumber).padStart(2, '0')}
              </h3>
              {analysisCode && analysisCode.name}
            </span>
            <span>
              <h4>{analysisCode && analysisCode.descriptionCN}</h4>
              <h4>{analysisCode && analysisCode.description}</h4>
            </span>
          </div>
          <br />
          <div>{analysisExplanationCN}</div>
          <div>{analysisExplanation}</div>
        </>
      )}
      <hr className='my-1' />
      <div className='grid-1fr1fr1fr'>
        <span>
          <small>Maintenance Oil & Solvant Waste</small>
          <h4>{maintenanceOilWaste ? 'Yes' : 'No'}</h4>
        </span>
        <span>
          <small>Maintenance Plastic & Metal Waste</small>
          <h4>{maintenancePlasticAndMetalWaste ? 'Yes' : 'No'}</h4>
        </span>
        <span>
          <small>Maintenance Spare Parts </small>
          <h4>{maintenanceSpareParts ? 'Yes' : 'No'}</h4>
        </span>
      </div>
      <hr className='my-1' />
      <div className='grid-1fr2fr'>
        <span>
          <small>Eng Repair Date</small>
          <h4>
            {engineeringRepairDate ? formatDate(engineeringRepairDate) : '/'}
          </h4>
        </span>
        <span>
          <small>Applicant Validation Date</small>
          <h4>
            {applicantValidationDate
              ? formatDate(applicantValidationDate)
              : '/'}
          </h4>
        </span>
      </div>
    </div>
  );
};

R3Item.propTypes = {
  r3: PropTypes.object.isRequired,
};

export default R3Item;
