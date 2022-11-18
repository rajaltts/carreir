import { GENERATE_REPORT_START, GENERATE_REPORT_FULFILLED, GENERATE_REPORT_FAILED } from '../constants/constant';

const initialState = {
    loading: false,
    error : '',
};

export default function GenerateReportReducer(state = initialState, action){
    switch(action.type){
        case GENERATE_REPORT_START: 
            return {
                loading: true,
            }
        case GENERATE_REPORT_FULFILLED:
          return {
            ...state,
            loading: false,

          }
        case GENERATE_REPORT_FAILED:
            return {
                ...state,
                loading: false,
                error : action.data
            }         
        default:
        return state;
    }
}