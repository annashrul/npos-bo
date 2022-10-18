import { AUTH } from '../actions/_constants';

const initialState = {
    errors: {}
}

export default function(state= initialState, action){
    switch(action.type){  
        case AUTH.GET_ERRORS:
            return{
                ...state,
                errors: action.payload
            } 
        default:
            return state;
    }
}