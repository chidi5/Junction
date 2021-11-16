import { GET_USER_ITEMS, GET_USER_DETAILS, PUT_PROFILE, PUT_IMAGE, GET_PROFILE } from '../actions/types.js';

const initialState = {
	profiles: [],
	edit:[],
	users: [],
	isSubmitted: null,
}

export default function(state = initialState, action) {
	switch(action.type) {
		case GET_USER_ITEMS:
		//localStorage.setItem('owners', action.payload.id);
			return {
				...state,
				profiles: action.payload
			}
		case GET_USER_DETAILS:
			return {
				...state,
				users: action.payload
			}
		case PUT_PROFILE:
			return {
				...state,
				edit: action.payload
			}
		case PUT_IMAGE:
			return {
				...state,
				edit: action.payload,
				isSubmitted: true
			}
		case GET_PROFILE:
			return {
				...state,
				edit: action.payload
			}	
		default:
			return state;
	}
}