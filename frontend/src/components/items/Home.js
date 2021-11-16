import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getHomeItems } from '../../actions/items';

export class Home extends Component {
	static PropTypes = {
		leads: PropTypes.array.isRequired,
		getHomeItems: PropTypes.func.isRequired,
		isAuthenticated: PropTypes.bool,
	};

	componentDidMount() {
		this.props.getHomeItems();
	}

	render() {
		if (this.props.isAuthenticated) {
	      return <Redirect to='/'/>;
	    }
	    const imag = "../../../static/frontend/img/profile.gif";

		return (
			<Fragment>
				<div className="width-wrapper width-display">
					<div className="flex-child intro-info">
					    <h1>The best place to display and discover Africa's top designers & creatives.</h1>
						<p>Junction is a<strong> social networking platform</strong> for digital designers and creatives to find & showcase creative work and home to Africa's best design professionals</p>
						<Link to="/register" className="button mypink mybig mybold">
							<span>Sign up</span>
						</Link>
					</div>
				  
				  	<div className="flex-child intro-info1">
					    <img src="../../../static/frontend/img/intro-img.svg" alt="" className="img-fluid"/>
						<span className="alignright">Art by <a href='https://www.freepik.com/vectors/background'>rawpixel.com</a></span>
					</div>

					<img src="../../../static/frontend/img/lines-2.svg" className="bckimg" alt=""/>
				</div>

				<section className="about">
					<div className="width-wrapper">
						<div className="homeCard one">
							<div className="homeCardIcon">
								<img src="../../../static/frontend/img/icon-1.svg"/>
							</div>
							<h2>Share Your Work</h2>
							<p>Become a part of the most active creative community in Africa by sharing your magic and what you're made of.</p>
							<Link to='/' className="button">
								<span>Explore</span>
							</Link>
						</div>

						<div className="homeCard two">
							<div className="homeCardIcon">
								<img src="../../../static/frontend/img/icon-1.svg"/>
							</div>
							<h2>Blog</h2>
							<p>Get inside view of what's trending in the creative space and amazing interviews with design industry leaders, tutorials and more.</p>
							<Link to='/' className="button">
								<span>Explore</span>
							</Link>
						</div>

						<div className="homeCard three">
							<div className="homeCardIcon">
								<img src="../../../static/frontend/img/icon-1.svg" />
							</div>
							<h2>Meet Designers</h2>
							<p>Meet and follow great designers and Checkout the rankings to see which designers are trending.</p>
							<Link to='/' className="button">
								<span>Explore</span>
							</Link>
						</div>
						<img src="../../../static/frontend/img/lines-4.svg" alt="" className="homeCardImage"/>
					</div>
				</section>

				<section className="moreView">
					<div className="width-wrapper item-grid">
						<div className="HomeContent">
							<div>
								<h2>Find inspiration from 1.8 million+ front-end designers and developers.</h2>
								<p>Browse and share work from world-className designers and developers in the front-end community.</p>
								<Link to="/">Explore</Link>
							</div>
						</div>
						{this.props.leads.map((lead) => (
						<article className="items" key={lead.id}>
							<div className="imgBx">
								{lead.asset_bundle.kind=='image' ? <img src={lead.asset_bundle.asset_urls.original} alt=""/>:<video loop preload="metadata" src={lead.asset_bundle.asset_urls.original}></video>}
								<div className="detail">
									<div className="detail-content">
										<div className="detail-title">For the gamers</div>
										<ul className="detail-container">
											<li className="detail-action">
												<Link to="/login" className="bookmark btn-form">
													<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
														<path d="m22 5h-11l-2-3h-7c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-13c0-1.104-.896-2-2-2zm-6 10h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3v-3c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
													</svg>
												</Link>
											</li>
											<li className="detail-action">
												<Link to="/login" className="love btn-form">
													<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
														<path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path>
													</svg>
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="user-container">
								<div className="user-information">
									<a className="hoverable url" href="#">
										{lead.owner.profile.image ? <img className="photo" alt={lead.owner.username} src={lead.owner.profile.image}/>
										:<img className="photo" alt={lead.owner.username} src={imag}/>
										}
										<span className="display-name">{lead.owner.username}</span>
									</a> 
						        </div>
						        <div className="imgStats-container">
								    <div className="image-statistic">
								    	<a>
									        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 15" fill="none" role="img" className="icon fill-current">
												<path d="M8.75 0.5H5.25C2.35025 0.5 0 2.85025 0 5.75C0 8.24783 1.74592 10.3344 4.08333 10.8652V14.5L8.16667 11H8.75C11.6497 11 14 8.64975 14 5.75C14 2.85025 11.6497 0.5 8.75 0.5Z"></path>
											</svg>
										</a>
										<span>{lead.total_comments}</span>
								    </div>
								    <ul className="image-statistic">
		        						<li>
		        							<a className="like-shot" title="Like this shot">
											    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon fill-current shot-tools-icon">
											    	<path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path>
											    </svg>
											</a>
		        						</li>
		        						<span>{lead.total_likes}</span>
		        					</ul>
								</div>
							</div>
						</article>
						))}
					</div>
				</section>

				<footer className="SiteFooter">
					<div className="width-wrapper SiteFooter_inside">
						<nav id="link-footer-codepen-links" aria-label="Links about Junction">
							<h4>Junction</h4>
							<a href="#">About</a>
							<a href="#">Blog</a>
							<a href="#">Podcast</a>
							<a href="#">Advertising</a>
							<a href="#">Docs</a>
							<a href="#">Support</a>
							<a href="#">Shop</a>
						</nav>
						<nav id="link-footer-for-links" aria-label="Junction for different uses">
							<h4>For</h4>
							<a href="#">Teams</a>
							<a href="#">Education</a>
							<a href="#">Privacy</a>
							<a href="#">Documentation</a>
						</nav>
						<nav id="link-footer-social-links" aria-label="Junction on Social Media">
							<h4>Social</h4>
							<a href="#">YouTube</a>
							<a href="https://twitter.com/Junctionfamily">Twitter</a>
							<a href="https://www.facebook.com/junction_community/">Facebook</a>
							<a href="https://www.instagram.com/junction_community/">Instagram</a>
						</nav>
						<nav id="link-footer-community-links">
							<h4>Community</h4>
							<a href="#">Spark</a>
							<a href="#">Challenges</a>
							<a href="#">Teams</a>
							<a href="#">Jobs</a>
							<a href="#">Code of Conduct</a>
						</nav>
						<div className="SiteFooter_copyright" id="link-footer-copyright">
							<h1 className="Logo_root">
								<a href="/" className="Logo_small">
									<h4>Junction</h4>
								</a>
							</h1>
							<p>©2020 Junction</p>
							<p className="slogan"><em>Be the Magic.</em></p>
						</div>
					</div>
				</footer>
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	leads: state.items.leads,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {getHomeItems})(Home);