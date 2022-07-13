import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AddNew from './AddNew';

const PageTitleBarEngineer = ({ auth, item, faIcon }) => {
  const lastChar = item.charAt(item.length - 1);

  let items = item[0].toUpperCase() + item.substring(1) + 's';

  // this is a simple function to pluralize
  // for more complex, look into https://github.com/plurals/pluralize

  if (lastChar === 'y') {
    items = item[0].toUpperCase() + item.substring(1, item.length - 1) + 'ies';
  }

  return (
    <div className='pageHeader'>
      <Link to='/dashboard'>
        <i className='fas fa-circle-arrow-left fa-2xl '> </i>{' '}
      </Link>
      <h1 className='large text-primary pageTitle'>
        <i className={faIcon}> </i> {items}
      </h1>
      <div className='pageActions'>
        {item !== 'user' &&
          auth &&
          auth.isAuthenticated &&
          auth.loading === false &&
          auth.user.isEngineer && <AddNew item={item} />}
      </div>
    </div>
  );
};

PageTitleBarEngineer.propTypes = {
  auth: PropTypes.object.isRequired,
  item: PropTypes.string.isRequired,
  faIcon: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PageTitleBarEngineer);
