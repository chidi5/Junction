import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) {
      		return <h2>Loading...</h2>;
      } else if (!auth.token) {
      		return <Redirect to='/home' />;
      } else {
        	return <Component {...props} />;
      }
    }}
  />
);

const mapStateToProps = (state) => ({
	auth: state.auth,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps)(PrivateRoute);