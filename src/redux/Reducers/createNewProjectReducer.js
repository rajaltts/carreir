import { actionConstants } from '@carrier/workflowui-globalfunctions';

const initialState = {
    projectData: {},
    isLoading: false,
    error: '',
    isExportProjectData: false 
};

export default function createNewProjectReducer(state = initialState, action){
    switch(action.type) {
        case actionConstants.FETCH_ADDPROJECT_START:
            return {
                ...state,
                isLoading: true,
                error:'',
            }
        case actionConstants.FETCH_ADDPROJECT_FULFILLED:
            return {
                ...state,
                isLoading: false,
                projectData: action.data,
                error:''
            }
        case actionConstants.FETCH_ADDPROJECT_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action && action.data && action.data.Message && action.data.Message[0]               
            }
        case actionConstants.RESET_PROJECT_ERROR_STATUS:
            return {
                ...state,
                error: ''
            }
        case actionConstants.UPDATE_EXPORT_PROJECT_DATA:
            return {
                ...state,
                projectData: action.data,
                isExportProjectData: true
            }
        case actionConstants.RESET_EXPORT_PROJECT_DATA:
            return {
                ...initialState
            }
        default:
            return state;
    }
}