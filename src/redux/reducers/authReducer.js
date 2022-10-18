import { AUTH} from '../actions/_constants';

const initialState = {
    isAuthenticated: false,
    user: {},
    id_log:''
}

export default function(state= initialState, action){
    switch(action.type){  
        case AUTH.SET_CURRENT_USER:
            return{
                ...state,
                user: action.payload
            } 
        case AUTH.SET_LOGGED_USER:
            return {
                ...state,
                isAuthenticated: action.payload
            }
        case AUTH.SET_OTORISASI_ID:
            return {
                ...state,
                id_log: action.payload
            }
            
        default:
            return state;
    }
}