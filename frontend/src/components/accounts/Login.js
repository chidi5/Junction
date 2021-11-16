import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

export class Login extends Component {
	state = {
		email: '',
		password: '',
		loggedin: false,
	}

	static propTypes = {
	    login: PropTypes.func.isRequired,
	    isAuthenticated: PropTypes.bool,
	};
	
	onSubmit = (e) => {
	    e.preventDefault();
	    this.props.login(this.state.email, this.state.password);
	    const loggedin = this.state.loggedin;
	    this.setState({loggedin: true});
	};

  	onChange = (e) => this.setState({ [e.target.name]: e.target.value });

	render() {

		const { email, password, loggedin} = this.state;

		if (this.props.isAuthenticated) {
	      return <Redirect to='/'/>;
	    }
	 
		return (
			<Fragment>
			<div className="splitl left logcolor">
			    <div className="centered txt">
			      <h2>Junction</h2>
			      <p>Discover the Magic, Be the Magic.</p>
			    </div>
			</div>

			<div className="splitr right">
			    <div className="centered">
			      <form className="validate-form flex-sb flex-w" onSubmit={this.onSubmit} >
			            <span className="login100-form-title pb-3">
			              Sign into Junction
			            </span>

			            <a href="#" className="btn-google mb-2">
			              <i className="fab fa-google" aria-hidden="true"></i>
			              Sign in with Google
			            </a>

			             <a href="#" className="btn-twitter ml-2">
			              <i className="fab fa-twitter"></i>
			            </a>

			            <div className="separator pt-3">Or</div>
			            
			            <div className="pt-3 pb-2">
			              <span className="txt1">
			                Username or Email
			              </span>
			            </div>
			            <div className="wrap-input100 validate-input" data-validate = "Username is required">
			              <input className="input100" type="text" onInput={(e) => e.target.value = ("" + e.target.value).toLowerCase()} name="email" value={email} onChange={this.onChange} />
			              <span className="focus-input100"></span>
			            </div>
			            
			            <div className="pt-3 pb-2">
			              <span className="txt1">
			                Password
			              </span>

			              <a href="#" className="txt2 bo1 ml-2">
			                Forgot?
			              </a>
			            </div>
			            <div className="wrap-input100 validate-input" data-validate = "Password is required">
			              <input className="input100" type="password" name="password" value={password} onChange={this.onChange} />
			              <span className="focus-input100"></span>
			            </div>

			            <div className="container-login100-form-btn mt-3">
			              <button className="login100-form-btn">
			                Sign In
			              </button>
			            </div>

			            <div className="w-full text-center pt-2">
			              <span className="txt2">
			                Not a member?
			              </span>
			              <Link to="/register" className="txt2 bo1">
			                Sign up now
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
});

export default connect(mapStateToProps, { login })(Login);