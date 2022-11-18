import { actionConstants } from '@carrier/workflowui-globalfunctions';

const initialState = {
    selectionData: {},
    configurationData: {},
    performanceData: {},
    tagDetails: {},
    projectDetails: {},
    isLoading: false,
    error: ''
};
export default function tagDetailInformation(state = initialState, action) {
    switch (action.type) {
        case actionConstants.TAG_DETAILS_LOADING:
            return {
                ...state,
                selectionData: {},
                configurationData: {},
                performanceData: {},
                error: '',
                isLoading: true
            }
        case actionConstants.TAG_DETAILS_LOADED:
            return {
                ...state,
                isLoading: false,
                selectionData: action.data.TagSelections || {},
                configurationData: action.data.TagConfigurations || {},
                performanceData: action.data.TagPerformance || {},
                error: ''
            }
        case actionConstants.TAG_DETAILS_FAILED:
            return {
                ...state,
                ...initialState,
                error: action && action.data
            }
        case actionConstants.TAG_DETAILS_REFRESH:
            return {
                ...state,
                ...initialState
            }
        case actionConstants.TAG_DETAILS_UPDATE:
            return {
                ...state,
                isLoading: false,
                tagDetails: action.data
            }
        case actionConstants.PROJECT_DETAILS_UPDATE:
            return {
                ...state,
                isLoading: false,
                projectDetails: action.data
            }
        case actionConstants.PROJECT_DETAILS_UPDATE_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action && action.data && action.data.Message && action.data.Message[0]
            }
        case actionConstants.TAG_CONFIGURATION_UPDATE:
            return {
                ...state,
                isLoading: false,
                configurationData: action.data.TagConfigurations
            }
        default:
            return state;
    }
}