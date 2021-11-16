import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getItems } from '../../actions/items';
import { getUserItems } from '../../actions/profiles';
import axios from 'axios';
import { tokenConfig } from '../../actions/auth';
import store from '../../store';
import $ from 'jquery';

let numLike = null;

export class Items extends Component {
	constructor(props) {
	    super(props);
	    this.handleLove = this.handleLove.bind(this);
	    this.getResponse = this.getResponse.bind(this);
	    this.getId = this.getId.bind(this);
	}

	static PropTypes = {
		items: PropTypes.array.isRequired,
		getItems: PropTypes.func.isRequired,
		getUserItems: PropTypes.func.isRequired,
		
	};

	componentDidMount() {
		this.props.getItems();

		$(document).ready(function() {
		  $('#dropdownList li').find("a").click(function(){
		    
		    $('#dropdown-button').html($(this).html()).append("<span class='caret'></span>");
		  });
		});

		//scroll horizontal
		var box = $(".box-inner"), x;
		$(".scroll").click(function() {
		  if ($(this).hasClass("scroll-forward")) {
		    //x = ((box.width() / 1)) + box.scrollLeft();
		    x = '+=156px';
		    box.animate({
		      scrollLeft: x,
		    })
		  } else {
		    //x = ((box.width() / 1)) - box.scrollLeft();
		    x = '-=156px';
		    box.animate({
		      scrollLeft: -x,
		    })
		  }
		});

		//play video on hover
		$(document).ready(function() {
			$('.imgBx video').on('mouseover', function(event) {
			  this.play();
			  this.muted = true;
			}).on('mouseout', function(event) {
			  //this.currentTime = 0;
			  this.pause();
			});
		});
	}

	getResponse(item_id)  {
		axios
			.post('/api/like/', {item_id: item_id}, tokenConfig(store.getState))
			.then(res=>{
				this.setState({
					payload: res.data
				});
      			//numLike = this.state.payload.total_likes;
      			$('#like'+item_id).text(this.state.payload.total_likes);
      			console.log(this.state.payload.total_likes);
      			let curr_state = this.state.payload.is_liked;
      			if(this.state.payload.is_liked){
			      	$('.love' +item_id).attr('id', 'lovetrue');
			      	$('.icon'+item_id).attr('id', 'icontrue');
			    } else {
			      	$('.love' +item_id).attr('id', 'lovefalse');
			      	$('.icon'+item_id).attr('id', 'iconfalse');
			    }
			}).catch(err => console.log(err));
	}

	handleLove(item_id) {
		console.log(item_id);
	  	this.getResponse(item_id);
	}

	getId(owner_name) {
		localStorage.setItem('owner', owner_name);
		let owner = localStorage.getItem('owner')
		//owners_id = owner_id;
		console.log(owner);
		//export default window.owners_id;
		this.props.getUserItems(owner_name);
	}

	render() {
		const imag = "../../../static/frontend/img/profile.gif";

		return (
			<Fragment>
				<div className="subnav">
					<div className="subnav-inner items-center d-flex flex-row">
						<div className="filter-views">
							<div className="dropdown btn-dropdown">
								<button id="dropdown-button" className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								    Popular
								    <span className="caret"></span>
								</button>
								<ul className="dropdown-menu" id="dropdownList">
								    <li><a href="#" className="active">Popular</a></li>
								    <li><a href="#">Followers</a></li>
								    <li><a href="#">New</a></li>
								</ul>
							</div>
						</div>
						<div className="filter-categories">
							<span className="scroll scroll-backward">
								<a href="#">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon ">
										<path d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z">
										</path>
									</svg>
								</a>
							</span>
							<span className="scroll scroll-forward">
								<a href="#">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon ">
										<path d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z">
										</path>
									</svg>
								</a>
							</span>
							<ul className="box-inner">
					            <li className="category sets-path active">
					              <a title="All" href="#">All</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Animation" href="#">Animation</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Branding" href="#">Branding</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Illustration" href="#">Illustration</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Mobile" href="#">Mobile</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Print" href="#">Print</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Product Design" href="#">Product Design</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Typography" href="#">Typography</a>
					            </li>
					            <li className="category sets-path ">
					              <a title="Web Design" data-param="category" data-value="web-design" data-track-sub-nav="true" href="#">Web Design</a>
					            </li>
					        </ul>
						</div>
						<div className="filter-settings">
					      	<a className="form-btn outlined filters-toggle-btn empty" data-name="Filters" data-track-sub-nav="true" href="#" data-dropdown-state="closed">
							    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" className="icon ">
									<path fillRule="evenodd" clipRule="evenodd" d="M0 6C0 5.17157 0.671573 4.5 1.5 4.5H22.5C23.3284 4.5 24 5.17157 24 6C24 6.82843 23.3284 7.5 22.5 7.5H1.5C0.671573 7.5 0 6.82843 0 6ZM3 12C3 11.1716 3.67157 10.5 4.5 10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H4.5C3.67157 13.5 3 12.8284 3 12ZM7.5 16.5C6.67157 16.5 6 17.1716 6 18C6 18.8284 6.67157 19.5 7.5 19.5H16.5C17.3284 19.5 18 18.8284 18 18C18 17.1716 17.3284 16.5 16.5 16.5H7.5Z">
									</path>
								</svg>

							    <span className="meatball">0</span>
							    <span className="label" title="Filters">Filters</span>
							</a>
					    </div>
					</div>
				</div>

				<div className="item-grid wrap-inner">
					{this.props.items.map((item) => (
					<article className="items" key={item.id}>
						<div className="imgBx">
							{item.asset_bundle.kind=='image' ? <img src={item.asset_bundle.asset_urls.original} alt=""/>:<video loop preload="metadata" src={item.asset_bundle.asset_urls.original}></video>}
							<div className="detail">
								<div className="detail-content">
									<div className="detail-title">{item.title}</div>
									<ul className="detail-container">
										<li className="detail-action">
											<a href="#" className="bookmark btn-form">
												<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
													<path d="m22 5h-11l-2-3h-7c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-13c0-1.104-.896-2-2-2zm-6 10h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3v-3c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
												</svg>
											</a>
										</li>
										<li className="detail-action">
											<a className={"love btn-form love" + item.id} id={"love" + item.is_liked}  onClick={() => this.handleLove(item.id)}>
												<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className="icon ">
													<path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path>
												</svg>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="user-container">
							<div className="user-information">
								<Link className="hoverable url" to={`/${item.owner.username}`} onClick={() => this.getId(item.owner.username)}>
									{item.owner.profile.image ? <img className="photo" alt={item.owner.username} src={item.owner.profile.image}/>
									:<img className="photo" alt={item.owner.username} src={imag}/>
									}
									<span className="display-name">{item.owner.username}</span>
								</Link> 
					        </div>
					        <div className="imgStats-container">
							    <div className="image-statistic">
							    	<a href="#">
								        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 15" fill="none" role="img" className="icon fill-current">
											<path d="M8.75 0.5H5.25C2.35025 0.5 0 2.85025 0 5.75C0 8.24783 1.74592 10.3344 4.08333 10.8652V14.5L8.16667 11H8.75C11.6497 11 14 8.64975 14 5.75C14 2.85025 11.6497 0.5 8.75 0.5Z"></path>
										</svg>

									</a>
									<span>{item.total_comments}</span>
							    </div>
							    <ul className="image-statistic stat">
	        						<li>
	        							<a className="like-shot" title="Like this shot" href="">
										    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" role="img" className={"icon fill-current shot-tools-icon icon"+ item.id} id={"icon" + item.is_liked}>
										    	<path d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"></path>
										    </svg>
										</a>
	        						</li>
	        						<span id={"like" + item.id}>{item.total_likes}</span>
	        					</ul>
							</div>
						</div>
					</article>
					))}
				</div>
				
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	items: state.items.items,
});

export default connect(mapStateToProps, {getItems, getUserItems})(Items);