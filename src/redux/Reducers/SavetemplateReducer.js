import { SAVETEMPLATE_START,SAVETEMPLATE_FULFILLED,SAVETEMPLATE_FAILED } from '../constants/constant';

const initialState = {
    records: [],
    isLoading: false,
    error: ''
};

export default function (state = initialState, action){      
    switch(action.type){
        case SAVETEMPLATE_START:
            return {
                ...state,
                isLoading: true
            }
        case SAVETEMPLATE_FULFILLED: 
            return {                
                ...state,
                isLoading: false,
                records: action.data,                                
            }
        case SAVETEMPLATE_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.data
            }
        default:
        return state;
    }
}

