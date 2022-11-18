import appConfig from '../../../Environment/environments';
import {
    ApiService, endPoints, showSuccessNotification, showErrorNotification, injectIntlTranslation, actionConstants
} from "@carrier/workflowui-globalfunctions";

export const exportProjectAction = (projectData, intl) => async (dispatch) => {
    const { ProjectID, ProjectName } = projectData;
    try {
        showSuccessMessage(dispatch, ProjectName, intl, "ProjectExportProgressMessage", true);
        const res = await ApiService(
            `${appConfig.api.eCatApimImportExportService}${endPoints.EXPORT_PROJECT}${ProjectID}`,
            "GET",
            null,
            "blob"
        );
        dispatch({ type: actionConstants.UPDATE_EXPORT_PROJECT_DATA, data: { projectData, apiResponse: res.data }})
    }
    catch (error) {
        showErrorMessage(dispatch, intl)
    }
}

export const clearExportedData = () => (dispatch) => {
    dispatch({ type: actionConstants.RESET_EXPORT_PROJECT_DATA })
}

export const showSuccessMessage = (dispatch, ProjectName, intl, message = "ProjectExportMessage", showProgress = false) => {
    const projectExportSuccessMessage = (injectIntlTranslation(intl, message)).replace('_EXPORTPROJECTNAME_', "\"" + ProjectName + "\"");
    dispatch(showSuccessNotification(projectExportSuccessMessage, !showProgress, showProgress));
}

export const showErrorMessage = (dispatch, intl) => {
    const failMessage = injectIntlTranslation(intl, "GenericErrorMessage");
    dispatch(showErrorNotification(failMessage));
}