import { GET_INITIAL_CONFIGURATION_LOADING, GET_INITIAL_CONFIGURATION_LOADED, SET_DEFAULT_CONFIGURATION_LOAD } from '../constants/constant';

const initialState = {
    initialData: {
        VariableDomains: []
    },
    tagData: [],
    isLoading: false
};

export default function configurationLoadReducer(state = initialState, action){     
    switch(action.type) {
        case GET_INITIAL_CONFIGURATION_LOADING:
            return {
                ...state,
                initialData: {
                    VariableDomains: []
                },
                tagData: [],
                isLoading: true
            };
        case GET_INITIAL_CONFIGURATION_LOADED:
            return {
                ...state,
                initialData: action.data.assignment,
                tagData: action.data.tagData,
                isLoading: false
            };
        case SET_DEFAULT_CONFIGURATION_LOAD:
            return {
                ...state,
                initialData: {
                    VariableDomains: []
                },
                tagData: [],
                isLoading: false
            }
        default:
            return state;
    }
}