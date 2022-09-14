import React, { Fragment, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PageTitleBar from '../layout/PageTitleBar';
import { getTechnicalSupports } from '../../actions/technicalsupport';
import formatDate from '../../utils/formatDate';
import Avatar from 'react-avatar';

const Technicalsupports = ({
  getTechnicalSupports,
  auth,
  technicalsupport: { technicalsupports, loading },
}) => {
  const query = useLocation();

  useEffect(() => {
    getTechnicalSupports(query.search);
  }, [getTechnicalSupports, query.search]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar
            item='technicalsupport'
            faIcon='fas fa-handshake-angle'
          />

          <div>
            {/* Show this year */}
            <Link to={`?from=${new Date().getFullYear()}-01-01`}>
              <i className='btn btn-dark fas fa-filter-circle-xmark'> 今年</i>
            </Link>
            <Link to={`/technicalsupports/`}>
              {/* Show only pending technicalsupport */}
              <i className='btn btn-dark fas fa-filter'> 未完成</i>
            </Link>
            {auth.user && auth.user.isEngineer && (
              <Link to={`/technicalsupports/?orderTaker=${auth.user._id}`}>
                {/* Only My technicalsupport */}
                <i className='btn btn-dark fas fa-user-check'>
                  {' '}
                  我的Tech Support
                </i>
              </Link>
            )}
          </div>

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-technicalsupport  '>
              <div className='attribute'></div>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>日期</div>
              <div className='attribute'>申请人</div>
              <div className='attribute'>申请内容</div>
              <div className='attribute'>希望完成日期</div>
              <div className='attribute'>接单人</div>
              <div className='attribute'>实际完成日期</div>
            </li>

            {/* The rest of the items in the list are the actual data */}
            {technicalsupports &&
              technicalsupports.length > 0 &&
              technicalsupports.map((technicalsupport) => (
                <li
                  key={technicalsupport._id}
                  className='item item-container item-container-technicalsupport '
                >
                  <div
                    className='attribute '
                    data-name='Open'
                  >
                    <Link to={`/technicalsupports/${technicalsupport._id}`}>
                      <i className='fas fa-eye'></i>
                    </Link>
                  </div>
                  <div
                    className='attribute'
                    data-name='Edit'
                  >
                    {auth && auth.isAuthenticated && (
                      <Link
                        to={`/technicalsupports/edit/${technicalsupport._id}`}
                      >
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div
                    className='attribute'
                    data-name='日期'
                  >
                    {technicalsupport.applicationDate &&
                      formatDate(technicalsupport.applicationDate)}
                  </div>
                  <div
                    className='attribute '
                    data-name='申请人'
                  >
                    {technicalsupport.applicant && (
                      <>
                        <Avatar
                          name={technicalsupport.applicant.name}
                          round={true}
                          size='22px'
                        />{' '}
                        {technicalsupport.applicantValidation ? (
                          <i className='fa-solid fa-xs fa-circle-check text-success'></i>
                        ) : (
                          <i className='fa-solid fa-xs fa-circle-xmark text-danger'></i>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    className='attribute'
                    data-name='申请内容'
                  >
                    {technicalsupport.description}
                  </div>
                  <div
                    className='attribute '
                    data-name='希望完成日期'
                  >
                    {technicalsupport.expectedDate &&
                      formatDate(technicalsupport.expectedDate)}
                  </div>
                  <div
                    className='attribute '
                    data-name='接单人'
                  >
                    {technicalsupport.orderTaker && (
                      <Avatar
                        name={technicalsupport.orderTaker.name}
                        round={true}
                        size='22px'
                      />
                    )}
                  </div>
                  <div
                    className='attribute '
                    data-name='实际完成日期'
                  >
                    {technicalsupport.completionDate &&
                      formatDate(technicalsupport.completionDate)}
                  </div>
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </section>
  );
};

Technicalsupports.propTypes = {
  getTechnicalSupports: PropTypes.func.isRequired,
  technicalsupport: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  technicalsupport: state.technicalsupport,
  auth: state.auth,
});

export default connect(mapStateToProps, { getTechnicalSupports })(
  Technicalsupports,
);
