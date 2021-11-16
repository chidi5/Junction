import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editProfile } from '../../actions/profiles';
import { getedit } from '../../actions/profiles';
import { editImage } from '../../actions/profiles';
import $ from 'jquery';
import _ from 'lodash';

let str = null;
export class EditProfile extends React.Component {
	state = {
		details: {},
	};

	static PropTypes = {
		profiles: PropTypes.array.isRequired,
		edit: PropTypes.object.isRequired,
	    isSubmitted: PropTypes.bool,
	    //auth: PropTypes.object.isRequired,
		
	};

	componentDidMount() {
		let string = window.location.pathname
		str = string.split('/')[1];
		//strs = str;
		//this.props.getUserItems(str);
		//this.props.getUserDetails(str);
		//this.props.editProfile(str)
		this.props.getedit(str);
		setTimeout(() => {this.loadVar()}, 1000);
	    
	}

	loadVar(e) {
		let { edit } = this.props.edit;
		this.setState({details: edit});
	}

	loadImage(e){
		e.preventDefault();
		const files = event.target.files[0];
	    this.setState({ image: files });
	}

	uploadNow(e){
		e.preventDefault();
		document.getElementById('edit-avatar').style.display = 'none';
		document.getElementById('avatar-form').style.display = 'block';
	}

	imageSubmit = (e) => {
		e.preventDefault();
		if (this.state.image) {
			console.log(str)
			this.props.editImage(str, this.state.image);
			$('#upload_alert').show();
			$('#image_alert').hide();
			if(this.props.isSubmitted) {
				let editLink = document.getElementById('edit-avatar-link');
				let delLink = document.getElementById('delete-avatar-button');
				if (editLink === null && delLink === null) {
					document.getElementById('edit-avatar').style.display = 'inline-block';
					document.getElementById('delete-avatar').style.display = 'inline-block';
					document.getElementById('avatar-form').style.display = 'none';
				}else{
					editLink.style.display = 'inline-block';
					delLink.style.display = 'inline-block';
					document.getElementById('avatar-form').style.display = 'none';
				}
			}
		}
		else {
			$('#image_alert').show();
			console.log(this.state.image)
			$('#upload_alert').hide();
		}
		
	}

	onSubmit = (e) => {
	    e.preventDefault();
	    this.props.editProfile(str, this.state.details.bio, this.state.details.location, this.state.details.website_url, this.state.details.portfolio_url, this.state.details.password);
	    $('#upload_alert').show();
		$('#image_alert').hide();
	};

	onChange = (e) => {
		const newDetails = {...this.state.details};
		newDetails[event.target.name] = event.target.value;
		this.setState({
		    details: newDetails,
		});
	}

	render() {
		const { edit } = this.props.edit;
		const { details } = this.state;
		const imag = "../../../static/frontend/img/profile.gif";
		console.log(details)
		
		let comp = (
			<Fragment>
				<a id="edit-avatar-link" className="form-sub edit-avatar" href="#" onClick={this.uploadNow.bind(this)}>Upload new picture</a>
				<input type="submit" value="Delete" alt="Delete" className="form-btn delete-avatar" id="delete-avatar-button"/>
			</Fragment>
		);

		let ref = (
			<Fragment>
				<a id="edit-avatar" className="form-sub edit-avatar" href="#" onClick={this.uploadNow.bind(this)}>Upload new picture</a>
				<input type="submit" value="Delete" alt="Delete" className="form-btn delete-avatar" id="delete-avatar"/>
			</Fragment>
		);

		return (
			<Fragment>
				<div id="image_alert" className="alert alert-danger sticky-top text-center" role="alert">
					Please upload an image!
				</div>

				<div id="upload_alert" className="alert alert-success sticky-top text-center" role="alert">
					Profile was successfully updated.
				</div>

				<div className="width-wrapper">
					<div id="wrap-inners">
					    <div id="content" role="main">
						    <div className="notice-alert">
						        <a href="#" className="close" aria-label="close">
						        	{edit.image ? <img width="25" alt="close" src={edit.image}/>
									:<img width="25" alt="close" src={imag}/>
									}
						        </a>
						    </div>

							<div className="constrained-content-alt">

								<div className="group">
								  	<div className="slat-header user account-slat-header">
									    <div className="slat-details">
									    	<h1>
									    		<a className="url" rel="contact" href="#">
									    			<picture>
									    				{edit.image ? <img className="photo" alt="Joshua" src={edit.image}/>
														 :<img className="photo" alt="Joshua" src={imag}/>
												  		}
													</picture>
									 				<span className="display-names">Joshua</span>
									 			</a>
									          	<span className="sep">/</span> Edit Profile
									      	</h1>
									        <h2>Set up your Dribbble presence and hiring needs</h2>
									    </div>
								  	</div>
								</div>

							  	<div className="secondary">
								    <ul className="vertical-sidenav account-menu hiring-profile-account-menu">
									    <li className="active"><a href="#">Edit Profile</a></li>
									    <li className="sub-item"><a href="#">Public Profile</a></li>
									    <li><a href="#">Account Settings</a></li>
									    <li><a href="#">Password</a></li>
									    <li><a href="#">Social Profiles</a></li>
									    <li><a href="#">Email Notifications</a></li>
									    <li><a href="#">Data Export</a></li>
									</ul>
							  	</div>

						  		<div id="main">

									<div id="avatar-preview" className="group">
										<form id="delete-avatar-form" disabled="disabled" className="edit_user">
										  	<input name="utf8" type="hidden" value="✓"/>
									  		<input type="hidden" name="_method" value="delete"/>
										  	<picture>
										  		{edit.image ? <img className="photo" alt="Joshua" src={edit.image}/>
												 :<img className="photo" alt="Joshua" src={imag}/>
										  		}
											</picture>
											<noscript>
											    <h4>JavaScript Not Enabled</h4>
											    <p>Uploading an avatar requires the use of JavaScript. If you’d like to upload an avatar, please enable JavaScript in your browser and refresh this page.</p>
											</noscript>
											{edit.image ? ref : comp }
										</form>
										{edit.image === null ?
											<form id="avatar-form" className="group" encType="multipart/form-data" onSubmit={this.imageSubmit}>
												<fieldset id="upload">
												    <input size="30" type="file" name="image" id="user_avatar" accept="image/png, image/jpeg, image/gif" onChange={this.loadImage.bind(this)}/>
												   	<p className="info">JPG, GIF or PNG. Max size of 800K</p>
												</fieldset>
												<div id="add-btn">
											      	<input type="submit" value="Upload Now" className="form-sub"/>
											    </div>
											</form>:
											<form id="avatar-form" className="group hide" encType="multipart/form-data" onSubmit={this.imageSubmit}>
												<fieldset id="upload">
												    <input size="30" type="file" name="image" id="user_avatar" accept="image/png, image/jpeg, image/gif" onChange={this.loadImage.bind(this)}/>
												   	<p className="info">JPG, GIF or PNG. Max size of 800K</p>
												</fieldset>
												<div id="add-btn">
											      	<input type="submit" value="Upload Now" className="form-sub"/>
											    </div>
											</form>
										}
									</div>

						    		<form className="gen-form with-messages profile-form specialty-widget-form" id="new_profile" encType="multipart/form-data" onSubmit={this.onSubmit} acceptCharset="UTF-8">
						    		
										<span className="ta-required">
										    <div className="form-field ">
										    	<fieldset>
										    		<div className="pt-3 pb-2">
										              	<span className="txt1 txt1-color">
										                	Name
										              	</span>
										            </div>
										            <div className="wrap-input100 validate-input" data-validate = "Username is required">
										              	<input className="input100" type="text" name="username" defaultValue="Joshua"/>
										              	<span className="focus-input100 focus-input"></span>
										            </div>
										    	</fieldset>
										    	<p className="message">We’re big on real names around here, so people know who’s who.</p>
										    </div>
										</span>

										<div className="form-field ">
											<fieldset>
												<div className="pt-3 pb-2">
										            <span className="txt1 txt1-color">
										                Location
										            </span>
										        </div>
										        <div className="wrap-input100 validate-input">
										            <input className="input100" type="text" name="location" defaultValue={details.location} onChange={this.onChange}/>
										            <span className="focus-input100 focus-input"></span>
										        </div>
											</fieldset>
										</div>

										<div id="bio">
										  	<div className="form-field ">
											  	<fieldset>
											  		<div className="pb-2">
										              	<span className="txt1 txt1-color">
										                	Bio
										              	</span>
										            </div>
											  		<span className="character-counter text-size-12 text-weight-700 text-medium absolute r-0 t-0">1024</span>
										            <div className="wrap-input100 validate-input">
										              	<textarea className="input101" type="text" name="bio" defaultValue={details.bio} onChange={this.onChange} maxLength="1024"></textarea>
										              	<span className="focus-input100 focus-input"></span>
										            </div>
											  	</fieldset>
											  	<p className="message">Brief description for your profile. URLs are hyperlinked.</p>
										  	</div>
										</div>

										<div className="relative mt50">
										    <h3 className="text-small-caps text-medium text-size-13 pb10 mb20 border-bottom-gray" id="online_presence">Online Presence</h3>

										    <div className="form-field ">
										    	<fieldset>
										    		<div className="pt-3 pb-2">
										              	<span className="txt1 txt1-color">
										                	Personal website
										              	</span>
										            </div>
										            <div className="wrap-input100 validate-input" data-validate = "Username is required">
										              	<input className="input100" type="text" name="website_url" defaultValue={details.website_url} onChange={this.onChange}/>
										              	<span className="focus-input100 focus-input"></span>
										            </div>
										    	</fieldset>
										    	<p className="message">Your home page, blog, or company site.</p>
										    </div>

										    <div className="flex flex-wrap items-center justify-between">
										      <div className="w-50-ns w-100 pr10-ns">
											      	<div className="form-field ">
												      	<fieldset>
												      		<div className="pt-3 pb-2">
												              	<span className="txt1 txt1-color">
												                	Portfolio URL
												              	</span>
												            </div>
												            <div className="wrap-input100 validate-input" data-validate = "Username is required">
												              	<input className="input100" type="text" name="portfolio_url" defaultValue={details.portfolio_url} onChange={this.onChange}/>
												              	<span className="focus-input100 focus-input"></span>
												            </div>
												      	</fieldset>
												      	<p className="message">Only shared with potential employers.</p>
											      	</div>
											    </div>
										    </div>

										    <div className="w-50-ns w-100 pl10-ns">
											    <div className="form-field ">
											    	<fieldset>
											    		<div className="pt-3 pb-2">
											              	<span className="txt1 txt1-color">
											                	Portfolio password
											              	</span>
												        </div>
												        <div className="wrap-input100 validate-input">
												            <input className="input100" type="text" name="password" defaultValue={details.password} onChange={this.onChange}/>
												            <span className="focus-input100 focus-input"></span>
											            </div>
											    	</fieldset>
											    	<p className="message">Only if needed.</p>
											    </div>
											</div>
										</div>
										
										<div className="form-btns">
										    <input type="submit" className="form-sub form-sub mr10-ns mb10 mb0-ns d-inline-block-ns w-auto-ns d-block w-100"/>
										</div>

									</form>
								</div>

							</div>

					  	</div>
					</div>

				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	edit: state.profiles,
	auth: state.auth,
  	isSubmitted: state.profiles.isSubmitted,
});

export default connect(mapStateToProps, {getedit, editProfile, editImage})(EditProfile);
