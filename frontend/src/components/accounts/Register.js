import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';


export class Register extends Component {
	state = {
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		password: '',
	}

	static propTypes = {
	    register: PropTypes.func.isRequired,
	    isAuthenticated: PropTypes.bool,
	    isRegistered: PropTypes.bool,
	 };

	onSubmit = (e) => {
	    e.preventDefault();
	    console.log('submit')
	    const { first_name, last_name, username, email, password } = this.state;
	    if (password.length < 6) {
	      this.props.createMessage({ passwordNotMatch: 'Password is too short' });
	    } else {
	      	const newUser = {
	      		first_name,
	      		last_name,
		        username,
		        email,
		        password,
	      	};
	      this.props.register(newUser);
	    }
	};

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

	render() {

		if (this.props.isAuthenticated) {
	      return <Redirect to='/'/>;
	    }

		const { first_name, last_name, username, email, password } = this.state;

		return (
			<Fragment>
				<div className="splitl left">
					<div className="centered txt">
				    	<h2>Junction</h2>
				    	<p>Discover the Magic, Be the Magic.</p>
				  	</div>
				</div>
				<div className="splitr right">
					<div className="centered">
					    <form className="validate-form flex-sb flex-w" onSubmit={this.onSubmit}>
					        <span className="login100-form-title pb-3">
					            Sign Up to Junction
					        </span>

					        <a href="#" className="btn-google">
					        	<i className="fab fa-google" aria-hidden="true"></i>
					            Sign up with Google
					        </a>

					        <a href="#" className="btn-twitter ml-2">
					            <i className="fab fa-twitter"></i>
					        </a>

					        <div className="separator pt-3">Or</div>

					        <div className="clearfix">
					            <div className="left_content">
					              	<div className="pt-3 pb-2">
					                	<span className="txt1">
					                  		First name
					                	</span>
					              	</div>
					              	<div className="wrap-input101 validate-input">
					                	<input className="input100" type="text" name="first_name" value={first_name} onChange={this.onChange} required/>
					                	<span className="focus-input100"></span>
					              	</div>
					            </div>
					            <div className="right_content">
					              	<div className="pt-3 pb-2">
					                	<span className="txt1">
					                  		Last name
					                	</span>
					              	</div>
					              	<div className="wrap-input102 validate-input">
					                	<input className="input100" type="text" name="last_name" value={last_name} onChange={this.onChange} required/>
					                	<span className="focus-input100"></span>
					              	</div>
					            </div>
					        </div>

						    <div className="pt-3 pb-2">
						        <span className="txt1">
						            Username
						        </span>
						    </div>
						    <div className="wrap-input102 validate-input" data-validate = "Username is required">
						        <input className="input100" type="text" name="username" value={username.toLowerCase()} onChange={this.onChange}/>
						        <span className="focus-input100"></span>
						    </div>
					          
					        <div className="pt-3 pb-2">
					            <span className="txt1">
					              Email
					            </span>
					        </div>
					        <div className="wrap-input100 validate-input" data-validate = "Email is required">
					           	<input className="input100" type="email" name="email" onChange={this.onChange} value={email} />
					            <span className="focus-input100"></span>
					        </div>
					          
					        <div className="pt-3 pb-2">
					            <span className="txt1">
					              Password
					            </span>
					        </div>
					        <div className="wrap-input100 validate-input" data-validate = "Password is required">
					            <input className="input100" type="password" name="password" onChange={this.onChange} value={password} placeholder="6+ characters" />
					            <span className="focus-input100"></span>
					        </div>

					        <div className="container-login100-form-btn mt-3">
					            <button className="login100-form-btn">
					              Sign Up
					            </button>
					        </div>

					        <div className="w-full text-center pt-2">
					            <span className="txt2">
					            	Already a member?
					            </span>
					            <Link to="/login" className="txt2 bo1">
					            	Sign In
					            </Link>
					        </div>
					    </form>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRegistered: state.auth.isRegistered,
});

export default connect(mapStateToProps, { register, createMessage })(Register);