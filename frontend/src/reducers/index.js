import { combineReducers } from 'redux';
import items from './items';
import errors from './errors';
import messages from './messages';
import auth from './auth';
import profiles from './profiles';

export default combineReducers({
  items,
  errors,
  messages,
  auth,
  profiles,
});