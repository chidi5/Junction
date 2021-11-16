import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import _ from 'lodash';

export class Header extends React.Component {
	static propTypes = {
	    auth: PropTypes.object.isRequired,
	    logout: PropTypes.func.isRequired,
	};

  	render() {
		const { isAuthenticated, user } = this.props.auth;
		const imag = "../../../static/frontend/img/profile.gif";

		const authLinks = (
			<Fragment>
		    	<form className="form-inline my-2 my-lg-0">	
					<input className="form-control mr-sm-2" type="text" placeholder="Search" id="searchinput"/>
					<button className="btn btn-secondary my-2 my-sm-0" type="submit" id="searchbtn">Search</button>
				</form>
				<li id="t-profile" className="tab-profile nav-tab-icon nav-item actions-item">
					<Link className="has-sub" to={user ? `/${user.username}` : ''}>
						{_.get(user, 'profile.image') ? <img className="profile-avatar" alt={user ? `${user.username}` : ''} src={_.get(user, 'profile.image')}/>
						:<img className="profile-avatar" alt={user ? `${user.username}` : ''} src={imag}/>
						}
					    <span className="profile-name">{user ? `${user.username}` : ''}</span>
					</Link>
				    <ul className="tabs">
				        <li className="your-profile-generic">
				            <a className="url" href="#">Josh</a>
				        </li>
						<li className="your-profile-name"><Link to={user ? `/${user.username}` : ''} >Profile</Link></li>

						<li className="rule"></li>

						<li className="edit-profile"><Link to={user ? `/${user.username + '/edit'}` : ''} >Edit Profile</Link></li>
						
						<li className="rule"></li>

						<li>
							<a href="#">
								<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path></svg>
								My Likes
							</a>  
						</li>
						<li>
							<a href="#">
								<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m22 5h-11l-2-3h-7c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-13c0-1.104-.896-2-2-2zm-6 10h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3v-3c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path></svg>
								My Collections
							</a>
						</li>

						<li className="rule"></li>

						<li><a href="#">Account Settings</a></li>
						<li><a href="" onClick={this.props.logout}>Sign Out</a></li>
				    </ul>
			    </li>
				<li className="form-inline my-2 my-lg-0">
			    	<Link to="/upload" className="butn pink">
						<span>Upload</span>
					</Link>
				</li>

				<hr/>

			    <div className="mobile-nav-profile">
			    	<Link className="mobile-nav-user" to={user ? `/${user.username}` : ''}>
			    		{_.get(user, 'profile.image') ? <img width="40" height="40" alt={user ? `${user.username}` : ''} src={_.get(user, 'profile.image')}/>
						:<img width="40" height="40" alt={user ? `${user.username}` : ''} src={imag}/>
						}
					    <span>{user ? `${user.username}` : ''}</span>
					</Link>
					<div className="mobile-nav-profile-links">
					    <div className="d-flex">
					    	<div className="w-60">
						    	<Link to={user ? `/${user.username}` : ''}>
						        	Profile
								</Link>

					            <a href="#">Account Settings</a>
					            <a rel="nofollow" href="" onClick={this.props.logout}>Sign Out</a>
							</div>
					        <div>
					        	<a href="#">My Likes</a>

					            <a href="#">My Collections</a>
					        </div>
					    </div>

					    <div className="pv20"></div>
					</div>
			   	</div>
			</Fragment>
	    );

	    const guestLinks = (
	    	<Fragment>
	      	<form className="form-inline my-2 my-lg-0">	
				<input className="form-control mr-sm-3" type="text" placeholder="Search" id="searchinput"/>
				<button className="btn btn-secondary my-2 my-sm-0" type="submit" id="searchbtn">Search</button>
			</form>
			<li className="form-inline my-2 my-lg-0">
		    	<Link to="/register" className="butn pink">
					<span>Sign Up</span>
				</Link>
				<Link to="/login" className="butn">
					<span>Log In</span>
				</Link>
		    </li>
		    </Fragment>
	    );

		return (
			<Fragment>
			<nav className="navbar navbar-expand-lg navbar-dark">
				<Link className="navbar-brand" to="/">Junction</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
				    <span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarColor02">
				    <ul className="navbar-nav mr-auto">
				    </ul>
				    <ul className="navbar-nav ml-auto">
				    	{isAuthenticated ? authLinks : guestLinks}
				    </ul>
				</div>
			</nav>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);