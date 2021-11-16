import axios from 'axios';

import { GET_ITEMS, GET_HOME_ITEMS, POST_ITEMS } from './types';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';


// GET ITEMS
export const getItems = () => (dispatch, getState) => {
  axios
    .get('/api/items/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_ITEMS,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
    //.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET HOME ITEMS
export const getHomeItems = () => (dispatch) => {
  axios
    .get('/api/leads/')
    .then((res) => {
      dispatch({
        type: GET_HOME_ITEMS,
        payload: res.data,
      });
    })
    //.catch(err => console.log(err));
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// POST ITEM
export const upload = (mime, title, tag, body, file) => (dispatch, getState) => {
  // Request Body
  const boddy = JSON.stringify({ mime, title, tag, body, file });

  axios.post('/api/media/item/', boddy, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: POST_ITEMS,
        payload: res.data,
      });
      if (res.status == 200) {window.location = "/" }
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};