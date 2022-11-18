import { actionConstants } from '@carrier/workflowui-globalfunctions';

const initialState = {
    isLoading: false,
    loadertext: ''
};

export default function loaderReducer(state = initialState, action) {
    switch (action.type) {
        case actionConstants.SHOW_LOADER:
            return {
                ...state,
                isLoading: true,
                loadertext: action.data.text,
                showFullPageLoader: action.data.showFullPageLoader
            }
        case actionConstants.HIDE_LOADER:
            return {
                ...state,
                isLoading: false,
                loadertext: ''
            }
        default:
            return state;
    }
}