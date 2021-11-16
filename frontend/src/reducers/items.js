import { GET_ITEMS, GET_HOME_ITEMS, POST_ITEMS } from '../actions/types.js';

const initialState = {
	items: [],
	leads: [],
	isUploaded: null,
}

export default function(state = initialState, action) {
	switch(action.type) {
		case GET_ITEMS:
			return {
				...state,
				items: action.payload
			}
		case GET_HOME_ITEMS:
			return {
				...state,
				leads: action.payload
			}
		case POST_ITEMS:
			return {
				...state,
				isUploaded: true,
				items: action.payload
			}
		default:
			return state;
	}
}