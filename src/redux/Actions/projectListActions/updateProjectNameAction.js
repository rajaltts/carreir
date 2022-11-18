import appConfig from '../../../Environment/environments';
import {
    ApiService, endPoints, refreshProjectList, injectIntlTranslation,
    showSuccessNotification, showErrorNotification
} from "@carrier/workflowui-globalfunctions";

export const projectNameEditAction = ({ projectData, intl, editedValue }) => (dispatch) => projectNameEdit({ projectData, intl, dispatch, editedValue })

const projectNameEdit = async ({ projectData, editedValue, intl, dispatch }) => {
    const { ProjectID, CustomerId, CustomerName } = projectData;
    const apiInput = {
        ProjectID: ProjectID,
        ProjectName: editedValue,
        CustomerId: CustomerId,
        CustomerName: CustomerName
    };
    try {
        await ApiService(`${appConfig.api.eCatApimAppService}${endPoints.POST_ADDPROJECTWITHSHARE}`, 'POST', apiInput);
        dispatch(refreshProjectList());
        const projectDeletionSuccessMessage = (injectIntlTranslation(intl, "UpdateProjectNameSuccessMessage")).replace('_PROJECTNAME_', "\"" + editedValue + "\"");
        dispatch(showSuccessNotification(projectDeletionSuccessMessage));
    }
    catch (error) {
        let failMessage = injectIntlTranslation(intl, "GenericErrorMessage");
        if (error.response && error.response.status === 409) {
            failMessage = injectIntlTranslation(intl, "ProjectNameAlreadyExists");
        }
        dispatch(showErrorNotification(failMessage));
    }
}
