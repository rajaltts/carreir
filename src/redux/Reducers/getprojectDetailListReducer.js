
import { FETCH_PROJECTDETAILLIST_START,FETCH_PROJECTDETAILLIST_FULFILLED,RESET_PROJECTDETAILLIST,FETCH_PROJECTDETAILLIST_FAILED } from '../constants/constant';

const initialState = {
    records: [],
    isLoading: false,
    error: ''
};

export default function (state = initialState, action){      
    switch(action.type){
        case FETCH_PROJECTDETAILLIST_START:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_PROJECTDETAILLIST_FULFILLED:            
            return {                
                ...state,
                isLoading: false,
                records: action.data,                                
            }
        case RESET_PROJECTDETAILLIST:            
            return {                
                ...state,
                isLoading: false,
                records: [],                                
            }    
        case FETCH_PROJECTDETAILLIST_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.data
            }
        default:
        return state;
    }
}