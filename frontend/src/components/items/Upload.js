import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { upload } from '../../actions/items';
import { appendScript } from '../../utils/appendScript';
import $ from 'jquery';

const fileDropBox  = document.getElementById('fileDropBox');
const fileUpload = document.getElementById('fileUpload');

export class Upload extends Component {
	state = {
		mime: '',
		title: '',
		tag: '',
		body: '',
		file: '',
		isVideoMuted: true,
	};

	componentDidMount() {
		appendScript("/static/frontend/js/bootstrap-tagsinput.js");
	}

	static propTypes = {
	    upload: PropTypes.func.isRequired,
	    isUploaded: PropTypes.bool,
	    auth: PropTypes.object.isRequired,
	};

	handleMuteState = () => {
	    this.setState(prevState => ({
	      isVideoMuted: !prevState.isVideoMuted
	    }));
	}

	getLab() {
		document.getElementById('lab').click();
	}

	loadFile(e){
		e.preventDefault();
	    var reader = new FileReader();
	    reader.onload = () => {
	       	$('#imgPrime').attr('src', reader.result);
	       	$('#imgPrime')[0].style.display = 'inline';
	        this.setState({ file: reader.result });
	    }
	    reader.readAsDataURL(e.target.files[0]);
	    this.setState({ mime: e.target.files[0].type });
	    //console.log(this.state.mime)
	}

	onSubmit = (e) => {
	    e.preventDefault();
	    let tabval = document.getElementById("tagInput").value.replace(/^,|,$/g, '').trim();
		const tag = this.state.tag
		if (tabval.indexOf(',') != -1) {
			let targ = tabval.split(/[,]+/).map(item=>item.trim());
			this.setState({tag: targ}, function () {this.props.upload(this.state.mime, this.state.title, this.state.tag, this.state.body, this.state.file);})
		}else {
			this.setState({tag: tabval}, function () {this.props.upload(this.state.mime, this.state.title, this.state.tag, this.state.body, this.state.file);})
		}
	    //this.props.upload(this.state.mime, this.state.title, this.state.tag, this.state.body, this.state.file);
	};

	onChange = (e) => this.setState({ [e.target.name]: e.target.value });

	render() {

		const { title, tag, body } = this.state;

		return (
			<Fragment>
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
					<Link className="navbar-brand mr-0 fir" to="/">Junction</Link>
					<Link className="navbar-brand mr-0 sec" to="/">Cancel</Link>

					<ul className="navbar-nav new-nav mr-auto my-2 my-lg-0 ml-auto">
					    <li className="nav-item head">
					    	<a className="nav-link new-link" href="#">Run Your Street</a>
					    </li>
					</ul>

					<ul className="navbar-nav ml-5" id="navright">
			            <li className="nav-item">
			              	<a className="nav-link new-link" href="#" >Help</a>
			            </li>
			        </ul>
				</nav>

				<div className="topic">
			    	<h4 className="topic-head">Run Your Street</h4>
			  	</div>

			  	<section className="ptop pbot">

			      	<div className="width-wrapper">

			      		<form className="validate-form" id="my-form" onSubmit={this.onSubmit}>

					        <div className="wrappr">
					        	{this.state.mime=='video/mp4' ? <video id="imgPrime" loop autoPlay muted={this.state.isVideoMuted} src=""></video>:<img id="imgPrime" src="" />}
					          	<div id="fileDropBox" className="clearfix" onClick={this.getLab}>
						            <div className="myleft mid-span">
						              <ul>
						                <li>
						                  <i className="fas fa-image fontimg"></i>       
						                  <p>One high resolution image<br/><span className="mid-span">PNG, JPG, GIF</span></p>
						                </li>
						              </ul>
						            </div>
						            <div className="myright mid-span">
						              <ul>
						                <li>
						                  <i className="fas fa-video fontimg"></i>       
						                  <p>Video<br/><span className="mid-span">MP4, 4:3, 24 sec </span></p>
						                </li>
						              </ul>
						            </div>
						            <div className="middle mid-span">
						              <ul>
						                <li>
						                  <i className="fas fa-image fontimg"></i>       
						                  <p>Animated Gif<br/><span className="mid-span">400x300, 800x600, 1600x1200</span></p>
						                </li>
						              </ul>
						            </div>
						            <div id="idle">
						              <div id="cloud">
						                <i className="fas fa-cloud-upload-alt" ></i>
						              </div>
						              <h1>Drag and drop image</h1>
						              <p className="mini">or <a href="#" className="browse">browse</a> to choose a file</p>
						              <p>(1600x1200 or larger recommended, up to 10MB each)</p>
						            </div>
						            <input type="file" name="file" id="fileUpload" onChange={this.loadFile.bind(this)} required/>
						            <p><label htmlFor="fileUpload" className="fileUploads"  id="lab"></label></p>
						        </div>
					          
					        </div>

					        <div className="title">

						        <div className="flex-sb flex-w">          
						            <div className="pt-3 pb-2">
						              <span className="txt1 txt1-color">
						                Title
						              </span>
						            </div>
						            <div className="wrap-input100 validate-input" data-validate = "Title is required">
						              <input className="input100" type="text" name="title" value={title} onChange={this.onChange} placeholder="Add Title" id="spnFilePath"/>
						              <span className="focus-input100 focus-input"></span>
						            </div>

						            <div className="pt-3 pb-2">
						              <span className="txt1 txt1-color">
						                Tags
						              </span>
						            </div>
						            <div className="tag-list validate-input">
						              <input id="tagInput" className="input100" data-role="tagsinput" type="text" onKeyUp={(e) => e.target.value = ("" + e.target.value).toLowerCase()} name="tag" value={tag} onChange={this.onChange}/>
						              <span className="focus-input100 focus-input"></span>
						            </div>
						            
						            <div className="pt-3 pb-2">
						              <span className="txt1 txt1-color">
						                Description
						              </span>
						            </div>
						            <div className="wrap-input100 validate-input" data-validate = "Description is required">
						              <textarea className="input101" type="text" name="body" value={body} onChange={this.onChange} placeholder="Tell us about your process and how you arrived at the design"></textarea>
						              <span className="focus-input100 focus-input"></span>
						            </div>
						        </div>

					        </div>

				        </form>

				    </div>

			    </section>

			    <footer className="uploadFooter">
				    <div className="clearfix upfoot">

				      	<div className="float-left foot">
				      		<Link to='/' type="button" className="btn btn-outline-light">Cancel</Link>
				      	</div>
				    	<div className="float-right">
				        	<button type="submit" form="my-form" className="btn formbtn">Publish to Junction</button>
				      	</div>

				      	<div className="centr foot">Show Your Magic</div>

				    </div>
				</footer>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
  isUploaded: state.items.isUploaded,
  auth: state.auth,
});

export default connect(mapStateToProps, { upload })(Upload);