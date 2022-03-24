import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { AddNew } from '../layout/AddNew';
import { getMachines } from '../../actions/machine';

const Machines = ({ getMachines, auth, machine: { machines, loading } }) => {
  useEffect(() => {
    getMachines();
  }, [getMachines]);
  return (
    <section className='container-large'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>
            <i className='fas fa-clipboard-list'> </i> List of Fixed Assets
            固定资产一览表
          </h1>
          <ol className='machines-grid machines-grid-container'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container header'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute-container equ-qua-designation-designationCN'>
                <div className='attribute-container equ-qua'>
                  <div className='attribute'>EQU No.</div>
                  <div className='attribute'>QUA No.</div>
                </div>
                <div className='attribute-container designation-designationCN'>
                  <div className='attribute'>设备名称</div>
                  <div className='attribute'>Designation</div>
                </div>
              </div>
              <div className='attribute-container afa-rfa'>
                <div className='attribute'>AFA</div>
                <div className='attribute'>RFA</div>
              </div>
              <div className='attribute-container manufacturer'>
                <div className='attribute'>制造商</div>
                <div className='attribute'>Manufacturer</div>
              </div>

              <div className='attribute-container category-department-location'>
                <div className='attribute-container category'>
                  <div className='attribute '>Category</div>
                </div>
                <div className='attribute-container department'>
                  <div className='attribute'>Department</div>
                  <div className='attribute'>Location</div>
                </div>
              </div>
              <div className='attribute-container investment-date'>
                <div className='attribute'>Invest.</div>
                <div className='attribute'>Date</div>
              </div>
            </li>

            {/* The rest of the items in the list are the actual data */}
            {machines && machines.length > 0 ? (
              machines.map((machine) => (
                <li className='item item-container'>
                  <div className='attribute' data-name='Actions'>
                    <i className='fas fa-edit'></i>
                    <br />
                    <i className='fas fa-trash'></i>
                  </div>

                  <div className='attribute-container equ-qua-designation-designationCN'>
                    <div className='attribute-container equ-qua'>
                      <div className='attribute' data-name='EQU No.'>
                        {machine.machineNumber}
                      </div>
                      <div className='attribute' data-name='QUA No.'>
                        {machine.qualityNumber}
                      </div>
                    </div>
                    <div className='attribute-container designation-designationCN'>
                      <div className='attribute' data-name='设备名称'>
                        {machine.designationCN}
                      </div>
                      <div className='attribute' data-name='Designation'>
                        {machine.designation}
                      </div>
                    </div>
                  </div>
                  <div className='attribute-container afa-rfa'>
                    <div className='attribute' data-name='AFA'>
                      AFA{' '}
                      {machine.afa &&
                        String(machine.afa.afaNumber).padStart(4, '0')}
                    </div>
                    <div className='attribute' data-name='RFA'>
                      RFA ⎵⎵⎵⎵
                    </div>
                  </div>
                  <div className='attribute-container manufacturer'>
                    <div className='attribute' data-name='制造商'>
                      {machine.manufacturer && machine.manufacturer.nameCN}
                    </div>
                    <div className='attribute' data-name='Manufacturer'>
                      {machine.manufacturer && machine.manufacturer.name}
                    </div>
                  </div>
                  <div className='attribute-container category-department-location'>
                    <div className='attribute-container category'>
                      <div className='attribute ' data-name='Category'>
                        {machine.category &&
                          machine.category.code +
                            ' - ' +
                            machine.category.trigram}
                      </div>
                    </div>
                    <div className='attribute-container department'>
                      <div className='attribute' data-name='Department'>
                        {machine.department && machine.department.trigram}
                      </div>
                      <div className='attribute' data-name='Location'>
                        {machine.department &&
                          machine.department.location &&
                          machine.department.location.floor + '/F'}
                      </div>
                    </div>
                  </div>
                  <div className='attribute-container investment-date'>
                    <div className='attribute' data-name='Invest. No.'>
                      {machine.investmentNumber &&
                        machine.investmentNumber.investmentNumber}
                    </div>
                    <div className='attribute' data-name='Acquired date'>
                      {machine.acquiredDate}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <h4>No Machine found</h4>
            )}
          </ol>
        </Fragment>
      )}
    </section>
  );
};

Machines.propTypes = {
  getMachines: PropTypes.func.isRequired,
  machine: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  machine: state.machine,
  auth: state.auth,
});

export default connect(mapStateToProps, { getMachines })(Machines);
