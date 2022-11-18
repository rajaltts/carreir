import { GET_INITIAL_SELECTION_LOADING, GET_INITIAL_SELECTION_LOADED, SET_DEFAULT_SELECTION_LOAD } from '../constants/constant';

const initialState = {
    initialData: {
        VariableDomains: {}
    },
    isLoading: false
};

export default function selectionLoadReducer(state = initialState, action){     
    switch(action.type) {
        case GET_INITIAL_SELECTION_LOADING:
            return {
                ...state,
                initialData: {
                    VariableDomains: []
                },
                isLoading: true
            };
        case GET_INITIAL_SELECTION_LOADED:
            return {
                ...state,
                initialData: action.translateRuleData,
                isLoading: false
            };
        case SET_DEFAULT_SELECTION_LOAD:
            return {
                ...state,
                initialData: {
                    VariableDomains: {}
                },
                isLoading: false
            }
        default:
            return state;
    }
}