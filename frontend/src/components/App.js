import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, withRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './layout/Header';
import Home from './items/Home';
import Dashboard from './items/Dashboard';
import Upload from './items/Upload';
import Alerts from './layout/Alerts';
import Login from './accounts/Login';
import Register from './accounts/Register';
import Profile from './profiles/Profile';
import EditProfile from './profiles/EditProfile';
import PrivateRoute from './common/PrivateRoute';

import { Provider } from 'react-redux';
import store from '../store';
import PropTypes from 'prop-types';
import { loadUser } from '../actions/auth';
import $ from 'jquery';

// Alert Options
const alertOptions = {
  timeout: 3000,
  position: 'top center',
};

const Main = withRouter(({ location }) => {
	return(
		<Fragment>
			{location.pathname !== '/upload' && location.pathname !== '/login' && location.pathname !== '/register'  ? <Header/>: ''}
			<Alerts/>
			<Switch>
				<PrivateRoute exact path='/' component = {Dashboard}/>
				<Route exact path='/home' component = {Home}/>
				<PrivateRoute exact path='/upload' component = {Upload}/>
				<Route exact path='/login' component = {Login}/>
				<Route exact path='/register' component = {Register}/>
				<Route exact path='/:id/edit' component = {EditProfile}/>
				<Route exact path='/:id' component = {Profile}/>
			</Switch>
		</Fragment>
	)
})

class App extends Component {

	componentDidMount() {
	    store.dispatch(loadUser());
	}
	
	render() {
  		//let HideHeader = window.location.pathname !== '/upload' ? <Header/>: ''
		return (
			<Provider store={store}>
				<AlertProvider template={AlertTemplate} {...alertOptions}>
				<Router>
					<Main/>
				</Router>
				</AlertProvider>
			</Provider>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));