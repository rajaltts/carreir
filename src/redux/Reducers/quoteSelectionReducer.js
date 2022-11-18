import { actionConstants } from "@carrier/workflowui-globalfunctions";

const initialState = {
    showSuccessModal: false,
    showProgressModal: false,
    showQuoteSelectionModal: false,
    quoteSelectionSuccessHandler: null,
    quoteSelectionSaveHandler: null,
    quoteSelectionLoadHandler: null,
    errorMsg: "",
};

const {
    SHOW_QUOTE_SELECTION_SUCCESS_DIALOG, CLOSE_QUOTE_SELECTION_SUCCESS_DIALOG,
    SHOW_QUOTE_SELECTION_DIALOG, CLOSE_QUOTE_SELECTION_DIALOG, SHOW_QUOTE_SELECTION_PROGRESS_DIALOG,
    CLOSE_QUOTE_SELECTION_PROGRESS_DIALOG
} = actionConstants;

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_QUOTE_SELECTION_SUCCESS_DIALOG:
            const { quoteSelectionSuccessHandler, errorMsg } = action.data;
            return {
                ...state,
                showSuccessModal: true,
                showProgressModal: false,
                showQuoteSelectionModal: false,
                quoteSelectionSuccessHandler,
                errorMsg,
            }
        case SHOW_QUOTE_SELECTION_DIALOG:
            const { 
                quoteSelectionSaveHandler,
                quoteSelectionLoadHandler
            } = action.data
            return {
                ...state,
                showSuccessModal: false,
                showProgressModal: false,
                showQuoteSelectionModal: true,
                quoteSelectionSaveHandler,
                quoteSelectionLoadHandler
            }
        case CLOSE_QUOTE_SELECTION_SUCCESS_DIALOG:
            return {
                ...state,
                showSuccessModal: false,
            }
        case CLOSE_QUOTE_SELECTION_DIALOG:
            return {
                ...state,
                showQuoteSelectionModal: false,
            }
        case CLOSE_QUOTE_SELECTION_PROGRESS_DIALOG:
            return {
                ...state,
                showProgressModal: false,
            }
        case SHOW_QUOTE_SELECTION_PROGRESS_DIALOG:
            return {
                ...state,
                showSuccessModal: false,
                showProgressModal: true,
                showQuoteSelectionModal: false,
            }
        default:
            return state;
    }
}