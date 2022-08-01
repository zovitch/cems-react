import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getR3 } from '../../actions/r3';
import Spinner from '../layout/Spinner';
import R3Item from '../r3s/R3Item';
import PageTitleBarSingleView from '../layout/PageTitleBarSingleView';
import Avatar from 'react-avatar';

const R3 = ({ getR3, r3: { r3, r3s }, auth }) => {
  const { r3Id } = useParams();

  useEffect(() => {
    getR3(r3Id);
  }, [getR3, r3Id]);

  return (
    <section className='container-large'>
      {r3 === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBarSingleView item='r3' />

          <div className='viewPageSplit2 py-2'>
            <div className='view-left'>
              <div className='lead'>
                <i className='fas fa-screwdriver'></i> R3
              </div>
              {r3 && <R3Item r3={r3} />}
            </div>
            <div className='view-right'>
              <div className='lead'>
                <i className='fas fa-screwdriver-wrench'></i> other R3s
              </div>
              <ul className='table-grid-container '>
                <li className='item item-container item-container-4b'>
                  <div className='attribute'></div>
                  {/* Enclose semantically similar attributes as a div hierarchy */}
                  <div className='attribute'>R3 No.</div>
                  <div className='attribute'>Date</div>
                  <div className='attribute'>Engineer</div>
                </li>

                {r3s &&
                  r3s.length > 0 &&
                  r3s.map((e) => (
                    <li
                      className='item item-container item-container-4b'
                      key={e._id}
                    >
                      <small className='attribute' data-name='Open'>
                        <Link to={`/r3s/${e._id}`}>
                          <i className='fas fa-eye'></i>
                        </Link>
                      </small>
                      <small className='attribute' data-name='R3 No.'>
                        {e.r3Number}
                      </small>
                      <small className='attribute' data-name='Repair Time'>
                        {e.r3Date && e.engineeringRepairDate && (
                          <>
                            {e.r3Date === e.engineeringRepairDate ? (
                              <span> &lt; 1 天</span>
                            ) : (
                              <h4>
                                {Math.abs(
                                  new Date(e.r3Date) -
                                    new Date(e.engineeringRepairDate)
                                ) /
                                  (1000 * 60 * 60)}{' '}
                                <span>小时</span>
                              </h4>
                            )}
                          </>
                        )}
                      </small>
                      <small className='attribute' data-name='Engineer'>
                        {e.repairEngineer && (
                          <Avatar
                            className='badge'
                            name={e.repairEngineer && e.repairEngineer.name}
                            round={true}
                            size='25px'
                          />
                        )}
                      </small>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Fragment>
      )}
    </section>
  );
};

R3.propTypes = {
  getR3: PropTypes.func.isRequired,
  r3: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  r3: state.r3,
  auth: state.auth,
});
export default connect(mapStateToProps, { getR3 })(R3);
