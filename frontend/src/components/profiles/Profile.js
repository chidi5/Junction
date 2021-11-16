import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getUserItems } from '../../actions/profiles';
import { getUserDetails } from '../../actions/profiles';
import { getedit } from '../../actions/profiles';
import { tokenConfig } from '../../actions/auth';
import store from '../../store';
import $ from 'jquery';
import _ from 'lodash';
import chunk from 'lodash/chunk';

export class Profile extends Component {
	constructor(props) {
	    super(props);
	    this.getFollow = this.getFollow.bind(this);
	}

	static PropTypes = {
		profiles: PropTypes.array.isRequired,
		users: PropTypes.object.isRequired,
		getUserItems: PropTypes.func.isRequired,
		getUserDetails: PropTypes.func.isRequired,
	    auth: PropTypes.object.isRequired,
		
	};

	componentDidMount() {
		//localStorage.getItem('owner')
		let string = window.location.pathname
		let str = string.split('/')[1];
		
		this.props.getUserItems(str);
		this.props.getUserDetails(str);

		setTimeout(() => {
			let { users } = this.props.users;
			var text= _.get(users, 'profile.bio');
			var match = /\r|\n/.exec(text);
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			var text1=text.replace(exp, "<a href='$1'>$1</a>");
			var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
			if (match) {	
				document.getElementById("biolink").innerHTML=text1.replace(exp2, '<br/>' + '$1<a target="_blank" href="http://$2">$2</a>');
			}else {
				document.getElementById("biolink").innerHTML=text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
			}
		}, 1000);
	}

	getFollow(valA, valB)  {
		axios
			.post('/api/follow/', {user_id: valA}, tokenConfig(store.getState))
			.then(res=>{
				this.setState({
					payload: res.data
				});
      			var Elsee = document.getElementById('see');
      			var Elunsee = document.getElementById('unsee');
      			if (Elsee === null && Elunsee == null){
      				document.getElementById('seen').style.display = "block";
      				document.getElementById('unseen').style.display = "none";
      			}else{
	      			Elsee.style.display = "none";
					Elunsee.style.display = "block";
				}
			}).catch(err => console.log(err));
	}

	getUnFollow(valA, valB)  {
		axios
			.post('/api/unfollow/', {user_id: valA}, tokenConfig(store.getState))
			.then(res=>{
				this.setState({
					payload: res.data
				});
      			var Elsee = document.getElementById('seen');
      			var Elunsee = document.getElementById('unseen');
      			if (Elsee === null && Elunsee == null){
      				document.getElementById('see').style.display = "block";
      				document.getElementById('unsee').style.display = "none";
      			}else{
	      			Elsee.style.display = "none";
					Elunsee.style.display = "block";
				}
			}).catch(err => console.log(err));
	}

	getResponse(profile_id)  {
		axios
			.post('/api/like/', {item_id: profile_id}, tokenConfig(store.getState))
			.then(res=>{
				this.setState({
					payload: res.data
				});
      			//numLike = this.state.payload.total_likes;
      			$('#like'+profile_id).text(this.state.payload.total_likes);
      			console.log(this.state.payload.total_likes);
      			let curr_state = this.state.payload.is_liked;
      			if(this.state.payload.is_liked){
			      	$('.love' +profile_id).attr('id', 'lovetrue');
			      	$('.icon'+profile_id).attr('id', 'icontrue');
			    } else {
			      	$('.love' +profile_id).attr('id', 'lovefalse');
			      	$('.icon'+profile_id).attr('id', 'iconfalse');
			    }
			}).catch(err => console.log(err));
	}

	handleLove(profile_id) {
		console.log(profile_id);
	  	this.getResponse(profile_id);
	}
	
	render() {
		const { users } = this.props.users;
		const { isAuthenticated, user } = this.props.auth;
		let comp, imag;
		const imgs = "../../../static/frontend/img/profile.gif";

		imag = <img className="profile-avatar" alt={users.username} src={_.get(users, 'profile.image')}/>

		if (isAuthenticated) {
			if(user.id === users.id) {
				comp = (
					<Link className="outlined form-btn tipsy-mobile-disabled link-btn unfollow" to={'/' + user.username + '/edit'} >
						<span>Edit Profile</span>
					</Link>
				);
			}
			if(user.id != users.id && !user.following.length ) {
				comp = (
					<Fragment>
						<a id='see' className="form-btn tipsy-mobile-disabled link-btn follow"  onClick={() => this.getFollow(users.id, user.id)}>
							<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m20 10h-6v-6c0-1.104-.896-2-2-2s-2 .896-2 2v6h-6c-1.104 0-2 .896-2 2s.896 2 2 2h6v6c0 1.104.896 2 2 2s2-.896 2-2v-6h6c1.104 0 2-.896 2-2s-.896-2-2-2z"></path></svg>
							<span>Follow</span>
						</a>
						<a id='unsee' className="outlined form-btn tipsy-mobile-disabled link-btn unfollow" onClick={() => this.getUnFollow(users.id, user.id)}>
							<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m21.28 4.473c-.848-.721-2.109-.604-2.817.262l-8.849 10.835-4.504-3.064c-.918-.626-2.161-.372-2.773.566s-.364 2.205.555 2.83l7.494 5.098 11.151-13.653c.707-.866.592-2.152-.257-2.874z"></path></svg>
							<span>Following</span>
						</a>
					</Fragment>
				);
			}
			if(user.id != users.id && user.following.length > 0) {
				user.following.map(function(val) {
					//return comp = (<h4>{val.following.username}</h4>);
					if(users.username === val.following.username) {
						comp = (
							<Fragment>
								<a id='unseen' className="form-btn tipsy-mobile-disabled link-btn follow"  onClick={() => this.getFollow(users.id, user.id)}>
									<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m20 10h-6v-6c0-1.104-.896-2-2-2s-2 .896-2 2v6h-6c-1.104 0-2 .896-2 2s.896 2 2 2h6v6c0 1.104.896 2 2 2s2-.896 2-2v-6h6c1.104 0 2-.896 2-2s-.896-2-2-2z"></path></svg>
									<span>Follow</span>
								</a>
								<a id='seen' className="outlined form-btn tipsy-mobile-disabled link-btn unfollow" onClick={() => this.getUnFollow(users.id, user.id)}>
									<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m21.28 4.473c-.848-.721-2.109-.604-2.817.262l-8.849 10.835-4.504-3.064c-.918-.626-2.161-.372-2.773.566s-.364 2.205.555 2.83l7.494 5.098 11.151-13.653c.707-.866.592-2.152-.257-2.874z"></path></svg>
									<span>Following</span>
								</a>
							</Fragment>
						);
					}
				}, this);
			}
		} else {
			comp = (
				<Link className="form-btn tipsy-mobile-disabled link-btn follow" to="/login">
					<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon "><path d="m20 10h-6v-6c0-1.104-.896-2-2-2s-2 .896-2 2v6h-6c-1.104 0-2 .896-2 2s.896 2 2 2h6v6c0 1.104.896 2 2 2s2-.896 2-2v-6h6c1.104 0 2-.896 2-2s-.896-2-2-2z"></path></svg>
						<span>Follow</span>
				</Link>
			);

		}

		return (
			
			<div className="width-wrapper">
				<div className="profile-masthead followed-by-current-user" >
					
	      			<section className="profile-simple-masthead">
						<div className="container-large masthead-wrapper">
						    <div className="masthead-avatar">
						    	{_.get(users, 'profile.image') ? imag :<img className="profile-avatar" alt={users.username} src={imgs}/>}
						    </div>
						    <div className="masthead-content">
						      	<h1 className="masthead-profile-name">{users.first_name + ' ' + users.last_name}</h1>
						        <p className="masthead-profile-locality">{_.get(users, 'profile.location')}</p>
						        <p className="masthead-profile-specializations" id="biolink">{_.get(users, 'profile.bio')}</p>
						    	<div className="masthead-actions">
						        	<div className="profile-action-buttons">
						  
						  				<div className="follow-prompt profile-action-item">
						    				{comp}
										</div>
									</div>

						      	</div>
						    </div>
						</div>
					</section>
	  			</div>
	  			<div className="container-large">
				  	<div className="profile-subnav">
					    <div className="profile-subnav-menu">
					      	<nav className="scrolling-subnav">
					        	<span className="scroll scroll-backward">
					          		<a className="d-none" href="#">
					          			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon ">
										<path d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z"></path></svg>
									</a>
	        					</span>
	        					<span className="scroll scroll-forward">
	          						<a className="d-none" href="#">
	          							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon ">
										<path d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z"></path></svg>
									</a>
	        					</span>

	        					<ul className="scrolling-subnav-list">
	          						<li className="shots active">
	  									<a href="#">
	    									<span className="label">Shots</span>
	    									<span className="count">253</span>
										</a>
									</li>

	          						<li className="collections">
	  									<a href="#">
	    									<span className="label">Collections</span>
	    									<span className="count">4</span>
										</a>
									</li>

	          						<li className="liked shots">
	  									<a href="#">
	    									<span className="label">Liked Shots</span>
											<span className="count">33,814</span>
										</a>
									</li>

	          						<li className="empty">
	  									<a href="#">
	    									<span>About</span>
	    								</a>
	    							</li>
	        					</ul>
	      					</nav>
	    				</div>

	      				<div className="profile-subnav-actions">
	            
							<div className="shots-filter">
	    						<span id="dropdown-button" className="btn-dropdown btn-dropdown-neue js-shots-filter-select " data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
	      							<a className="form-btn outlined btn-dropdown-link" href="#" data-dropdown-state="closed">
	        							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon btn-dropdown-caret">
										<path d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z"></path></svg>

	        							<span className="js-current-filter">Recent Shots</span>
	      							</a>
								    <div className="btn-dropdown-options dropdown-menu">
								        <ul>
								            <li><a className="dropdown-item active" href="#">Recent Shots</a></li>
								            <li><a className="dropdown-item" href="#">Popular Shots</a></li>
								        </ul>
								    </div>
	    						</span>
							</div>


	      				</div>
	  				</div>
				</div>
				<div id="wrap-inner" className="item-grid wrap-inner">
					{this.props.profiles.map((profile) => (
					<article className="items" key={profile.id}>
						<div className="imgBx">
							{profile.asset_bundle.kind=='image' ? <img src={profile.asset_bundle.asset_urls.original} alt=""/>:<video loop preload="metadata" src={Profile.asset_bundle.asset_urls.original}></video>}
							<div className="detail">
								<div className="detail-content">
									<div className="detail-title">{profile.title}</div>
									<ul className="detail-container">
										<li className="detail-action">
											<a href="#" className="bookmark btn-form">
												<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
													<path d="m22 5h-11l-2-3h-7c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-13c0-1.104-.896-2-2-2zm-6 10h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3v-3c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
												</svg>
											</a>
										</li>
										<li className="detail-action">
											<a className={"love btn-form love" + profile.id} id={"love" + profile.is_liked}  onClick={() => this.handleLove(profile.id)}>
												<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
													<path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path>
												</svg>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</article>
					))}
				</div>
			</div>
			
		)
	}
}

const mapStateToProps = (state) => ({
	profiles: state.profiles.profiles,
	users: state.profiles,
	auth: state.auth
});

export default connect(mapStateToProps, {getUserItems, getUserDetails, getedit})(Profile);