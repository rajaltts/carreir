import React from 'react';
import appConfig from '../../../Environment/environments';
import {
    ApiService, endPoints, showSuccessNotification,
    showErrorNotification, injectIntlTranslation, refreshProjectList
} from "@carrier/workflowui-globalfunctions";
import TagLockDeleteError from "../../../components/common/controls/notification/TagLockDeleteErrorNotification";

export const deleteProjectAction = ({projectData, intl}) => (dispatch) => {
    deleteProject({projectData, dispatch, intl});
}

const deleteProject = async({projectData, dispatch, intl}) => {
    const projectNameStyle = {
        color: "#333333",
        fontWeight: 700,
        cursor: "default !important",
    }
    const errorMessageStyle = {
        color: "#EB5623",
        marginTop: "10px",
    }
    const {ProjectID, ProjectName} = projectData;
    try {
        await ApiService(`${appConfig.api.eCatApimAppService}${endPoints.POST_DELETE_PROJECT}${ProjectID}`, 'DELETE');
        dispatch(refreshProjectList());
        const projectDeletionSuccessMessage = (injectIntlTranslation(intl, "ProjectDeletionSuccessMessage")).replace('_SELECTIONNAME_', "\"" + ProjectName + "\"");
        dispatch(showSuccessNotification(projectDeletionSuccessMessage));
    }
    catch (error) {
        const { ErrorCode: Code, Message, Users } = error?.response?.data || {};
        let failMessage = injectIntlTranslation(intl, "GenericErrorMessage");
        if (error.response.status === 409) {
            const { ErrorCode, Users } = JSON.parse(error.response.data);
            if (ErrorCode === 1003) {
                const message = (
                    <div>
                        <span>{injectIntlTranslation(
                            intl,
                            "TheProject"
                        )}</span>
                        <span id="names">{" " + ProjectName + " "}</span>
                        <span>{injectIntlTranslation(
                            intl,
                            "CouldNotRemove"
                        )}</span>
                    </div>
                );
                const subMessage = injectIntlTranslation(intl, "ProjectInEditMode") + " " + Users;
                failMessage = <TagLockDeleteError intl={intl} message={message} subMessage={subMessage} />
            }
        }
        dispatch(showErrorNotification(failMessage));
    }
}