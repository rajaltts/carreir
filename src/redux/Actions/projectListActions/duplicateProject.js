import React from "react";
import appConfig from "../../../Environment/environments";
import {
  ApiService,
  endPoints,
  showSuccessNotification,
  showErrorNotification,
  injectIntlTranslation,
  refreshProjectList,
} from "@carrier/workflowui-globalfunctions";

export const duplicateProjectAction =
  ({ projectData, intl }) =>
  (dispatch) => {
    duplicateProject({ projectData, dispatch, intl });
  };

const duplicateProject = async ({ projectData, dispatch, intl }) => {
  const { ProjectID, ProjectName } = projectData;
  try {
    await ApiService(
      `${appConfig.api.eCatApimAppService}${endPoints.POST_DUPLICATE_PROJECT}${ProjectID}`, 'POST');
    dispatch(refreshProjectList());
    const ProjectDuplicateSuccessMessage = injectIntlTranslation(
      intl,
      "ProjectDuplicateSuccessMessage"
    ).replace("_SELECTIONNAME_", '"' + ProjectName + '"');
    dispatch(showSuccessNotification(ProjectDuplicateSuccessMessage));
  } catch (error) {
    let failMessage = injectIntlTranslation(intl, "GenericErrorMessage");
    dispatch(showErrorNotification(failMessage));
  } 
};