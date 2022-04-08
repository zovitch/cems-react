import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMachine } from '../../actions/machine';
import Spinner from '../layout/Spinner';
import MachineItem from '../machines/MachineItem';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';

const Machine = ({ getMachine, machine: { machine }, auth }) => {
  const { machineId } = useParams();

  useEffect(() => {
    getMachine(machineId);
  }, [getMachine, machineId]);

  return (
    <section className='container'>
      {machine === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='machine' />

          <div className='viewPage-25-75 py-2'>
            <div className='view-25'>
              <div className='lead'>
                <i className='fas fa-clipboard'></i> Machine
              </div>
              <MachineItem machine={machine} />
            </div>
            <div className='view-75'>
              <div className='lead'>
                <i className='fas fa-clipboard-list'></i> Show some stuff here
                @NICO
              </div>
              <div className='cards'>some stuff</div>
            </div>
          </div>
        </Fragment>
      )}
    </section>
  );
};

Machine.propTypes = {
  getMachine: PropTypes.func.isRequired,
  machine: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  machine: state.machine,
  auth: state.auth,
});
export default connect(mapStateToProps, { getMachine })(Machine);
