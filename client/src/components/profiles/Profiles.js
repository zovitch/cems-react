import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getUsers } from '../../actions/user';
import PageTitleBar from '../layout/PageTitleBar';

const Profiles = ({ getUsers, auth, user: { users, loading } }) => {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <section className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PageTitleBar item='user' faIcon='fas fa-users' />

          <ul className='table-grid-container my-2'>
            {/* The first list item is the header of the table  */}
            <li className='item item-container item-container-3'>
              <div className='attribute'></div>
              {/* Enclose semantically similar attributes as a div hierarchy */}
              <div className='attribute'>Name</div>
              <div className='attribute'>Departments</div>
            </li>

            {/* The rest of the items in the list are the actual data */}

            {users &&
              users.length > 0 &&
              users.map((user) => (
                <li
                  key={user._id}
                  className='item item-container item-container-3'
                >
                  <div className='attribute' data-name='Actions'>
                    {auth &&
                      auth.isAuthenticated &&
                      auth.user._id === user._id && (
                        <Link to={`/users/edit/${user._id}`}>
                          <i className='fas fa-edit'></i>
                        </Link>
                      )}
                  </div>
                  <div className='attribute' data-name='Name'>
                    {user.name}
                  </div>
                  <div className='attribute' data-name='Departments'></div>
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </section>
  );
};

Profiles.propTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default connect(mapStateToProps, { getUsers })(Profiles);
