import { actionConstants } from '@carrier/workflowui-globalfunctions'

const initialState = {
    isModalOpen: false,
    saveTagHandler: null,
    selectionName: ""
};

const { SHOW_SAVETAG, CLOSE_SAVETAG } = actionConstants

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_SAVETAG:
            return {
                ...state,
                isModalOpen: true,
                saveTagHandler: action.data.saveTagHandler,
                selectionName: action.data.selectionName
            }
        case CLOSE_SAVETAG:
            return {
                ...state,
                isModalOpen: false,
                saveTagHandler: null,
                selectionName: ""
            }
        default:
            return state;
    }
}