import { actionConstants } from '@carrier/workflowui-globalfunctions'

const initialState = {
    isTemplateModalOpen: false,
    lookUpKey: "TagTemplateName",
    productBuilderId: "",
    errorMsg: "",
    getTemplateList: null,
    saveTemplateHandler: null,
    validationHandler: null,
    existingTemplates: [],
    isLoading: true
};

const { SHOW_SAVE_TEMPLATE, CLOSE_SAVE_TEMPLATE, SAVE_TEMPLATE_FETCH, UPDATE_TEMPLATE_ERROR } = actionConstants

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_SAVE_TEMPLATE:
            return {
                ...state,
                isTemplateModalOpen: true,
                lookUpKey: action.data.lookUpKey,
                productBuilderId: action.data.productBuilderId,
                getTemplateList: action.data.getTemplateList,
                saveTemplateHandler: action.data.saveTemplateHandler,
                validationHandler: action.data.validationHandler,
                errorMsg: action.data.errorMsg,
                activeTab: action.data.activeTab
            }
        case SAVE_TEMPLATE_FETCH:
            return {
                ...state,
                errorMsg: action.data.errorMsg,
                existingTemplates: action.data.existingTemplates,
                isLoading: action.data.isLoading
            }
        case UPDATE_TEMPLATE_ERROR:
            return {
                ...state,
                errorMsg: action.data.errorMsg
            }
        case CLOSE_SAVE_TEMPLATE:
            return initialState
        default:
            return state;
    }
}