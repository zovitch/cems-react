import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getDepartments } from '../../actions/department';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import PageTitleBar from '../layout/PageTitleBar';
import nth from '../../utils/nth';

const Departments = ({
  getDepartments,
  auth,
  department: { departments, loading },
}) => {
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar item='department' faIcon='fas fa-briefcase' />

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-6'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Trigram</div>
              <div className='attribute'>Name</div>
              <div className='attribute'>NameCN</div>
              <div className='attribute'>Owners</div>
              <div className='attribute'>Location</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {departments &&
              departments.length > 0 &&
              departments.map((department) => (
                <li
                  key={department._id}
                  className='item item-container item-container-6'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth && auth.isAuthenticated && (
                      <Link to={`/departments/edit/${department._id}`}>
                        <i className='fas fa-edit'></i>
                      </Link>
                    )}
                  </div>
                  <div className='attribute' data-name='Trigram'>
                    {department.trigram}
                  </div>
                  <div className='attribute' data-name='Name'>
                    {department.name}
                  </div>
                  <div className='attribute' data-name='NameCN'>
                    {department.nameCN}
                  </div>
                  <div className='attribute' data-name='Owners'>
                    {department.owners.length > 0 &&
                      department.owners.map((owner) => (
                        <Link key={owner._id} to={`/users/${owner._id}`}>
                          <Avatar
                            className='badge'
                            name={owner.name}
                            round={true}
                            size='30px'
                          />
                        </Link>
                      ))}
                  </div>
                  <div className='attribute' data-name='Location'>
                    {department.location &&
                      nth(department.location.floor) +
                        ' floor ' +
                        department.location.initials}
                  </div>
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </section>
  );
};

Departments.propTypes = {
  getDepartments: PropTypes.func.isRequired,
  department: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  department: state.department,
  auth: state.auth,
});

export default connect(mapStateToProps, { getDepartments })(Departments);
