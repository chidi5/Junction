import axios from 'axios';

import { GET_USER_ITEMS, GET_USER_DETAILS, PUT_PROFILE, PUT_IMAGE, GET_PROFILE } from './types';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';
//import owners_id from '../components/items/Items';

//const owner_id = localStorage.getItem('owner');
// GET USER ITEMS
export const getUserItems = (owner_name) => (dispatch) => {
  axios
    .get('/api/items/'+owner_name+'/profile/')
    .then((res) => {
      dispatch({
        type: GET_USER_ITEMS,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
    //.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET USER DETAILS
export const getUserDetails = (owner_name) => (dispatch) => {
  axios
    .get('/api/auth/user/'+owner_name+'/profile/')
    .then((res) => {
      dispatch({
        type: GET_USER_DETAILS,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
    //.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET PROFILE
export const getedit = (owner_name) => (dispatch) => {
  // Request Body
  axios.get('/api/edit/'+owner_name+'/profile/')
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      //if (res.status == 200) {window.location = "/" }
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// EDIT PROFILE
export const editProfile = (owner_name, bio, location, website_url, portfolio_url, password) => (dispatch) => {
  // Request Body
  const config = { headers: {'Content-Type': 'multipart/form-data' }};
  const formData = new FormData();

  formData.append("bio", bio);
  formData.append("location", location);
  formData.append("portfolio_url", portfolio_url);
  formData.append("website_url", website_url);
  formData.append("password", password);

  axios.put('/api/edit/'+owner_name+'/profile/', formData, config)
    .then((res) => {
      dispatch({
        type: PUT_PROFILE,
        payload: res.data
      });
      //if (res.status == 200) {window.location = "/" }
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// EDIT PROFILE IMAGE
export const editImage = (owner_name, image) => (dispatch) => {
  // Request Body
  const config = { headers: {'Content-Type': 'multipart/form-data' }};
  const formData = new FormData();

  formData.append("image", image);

  axios.put('/api/edit/'+owner_name+'/profile/', formData, config)
    .then((res) => {
      dispatch({
        type: PUT_IMAGE,
        payload: res.data
      });
      //if (res.status == 200) {window.location = "/" }
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};