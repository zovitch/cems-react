import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import EditCurrent from './EditCurrent';

const PageTitleBarSingleView = ({ auth, item }) => {
  const lastChar = item.charAt(item.length - 1);

  let items = item + 's';

  // this is a simple function to pluralize
  // for more complex, look into https://github.com/plurals/pluralize

  if (lastChar === 'y') {
    items = item.substring(0, item.length - 1) + 'ies';
  }

  return (
    <div className='pageHeader'>
      <Link to={`/${items}`}>
        <i className='fas fa-circle-arrow-left fa-2xl '> </i>
      </Link>
      <h1 className='large text-primary pageTitle'>
        {item[0].toUpperCase() + item.substring(1)} Detail
      </h1>
      <div className='pageActions'>
        {auth && auth.isAuthenticated && auth.loading === false && (
          <EditCurrent item={items} />
        )}
      </div>
    </div>
  );
};

PageTitleBarSingleView.propTypes = {
  auth: PropTypes.object.isRequired,
  item: PropTypes.string.isRequired,
  // link: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PageTitleBarSingleView);
