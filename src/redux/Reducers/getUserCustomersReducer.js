import { CUSTOMER_DETAILS_LOADING, CUSTOMER_DETAILS_LOADED, CUSTOMER_DETAILS_LOADING_FAILED } from '../constants/constant';

const customerinitialState = {
    records: [],
    isLoading: false,
    customererror: ''
};

export default function getUserCustomersReducer(state = customerinitialState, action){
    switch(action.type){
        case CUSTOMER_DETAILS_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case CUSTOMER_DETAILS_LOADED:
            return {
                ...state,
                isLoading: false,
                records: action.data
            }
        case CUSTOMER_DETAILS_LOADING_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.data
            }
        default:
            return state;
    }
}
