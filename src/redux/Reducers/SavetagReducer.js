import { SAVETAG_START,SAVETAG_FULFILLED,SAVETAG_FAILED, EDITTAG_START, EDITTAG_FULFILLED, EDITTAG_FAILED } from '../constants/constant';

const initialState = {
    records: [],
    isLoading: false,
    errorName: ''
};

export default function (state = initialState, action){     
    state.errorName="";
    switch(action.type){
        case SAVETAG_START:
        case EDITTAG_START:
            return {
                ...state,
                isLoading: true,
            }
        case SAVETAG_FULFILLED:
        case EDITTAG_FULFILLED: 
            return {                
                ...state,
                isLoading: false,
                records: action.data,  
            }
        case SAVETAG_FAILED:
            return {
                ...state,
                isLoading: false,
                errorName: action.error,
            }
            case EDITTAG_FAILED:
                return {
                    ...state,
                    isLoading: false,
                }
        default:
        return state;
    }
}