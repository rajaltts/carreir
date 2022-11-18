import appConfig from '../../../Environment/environments';
import {
    ApiService, endPoints, showSuccessNotification,
    showErrorNotification, injectIntlTranslation, refreshProjectList
} from "@carrier/workflowui-globalfunctions";
import { refreshTagGrid } from "../getTagList";

export const copyTag = (copyTagProps) => (dispatch) => {
    const { tagData, intl, callback, refreshGrid = true } = copyTagProps;
    const { TagId, TagName, ProjectId } = tagData;
    const copyObj = {
        TagId,
        TagName,
        intl,
        newProjectId: ProjectId,
        dispatch,
        refreshGrid
    }
    if (callback) {
        copyObj.callback = callback
    }
    copyAction(copyObj);
}

export const copyTagProject = (copyTagProjectProps) => (dispatch) => {
    const { tagData, tagName, newProjectId, intl } = copyTagProjectProps;
    const { TagId, ProjectId } = tagData;
    const refreshGrid = (newProjectId === ProjectId);
    copyAction({
        TagId,
        TagName: tagName,
        intl,
        newProjectId,
        dispatch,
        refreshGrid,
        isCopytoAnotherProject: true
    });
}

export const copyAction = async (copyTagActionProps) => {
    const { TagId, TagName, dispatch, intl, newProjectId,
        refreshGrid = false, isCopytoAnotherProject = false, callback } = copyTagActionProps;
    const jsonData = {
        newTagName: TagName,
        tagId: TagId,
        projectId: newProjectId
    };
    try {
        const apiUrl = `${appConfig.api.eCatApimAppService}${endPoints.POST_COPY_SELECTIONS}newTagName=${TagName}&tagId=${TagId}&projectId=${newProjectId}&isCopytoAnotherProject=${isCopytoAnotherProject}`;
        await ApiService(apiUrl, 'POST', jsonData);
        refreshGrid && dispatch && dispatch(refreshTagGrid());
        const successMessage = (injectIntlTranslation(intl, "SelectionCopiedSuccessMessage")).replace('_EXISTINGSELECTION_', "\"" + TagName + "\"");
        dispatch && dispatch(showSuccessNotification(successMessage));
        dispatch && dispatch(refreshProjectList())
        callback && callback(true)
    }
    catch (error) {
        if (error.response && error.response.data.ECatCode === 1005) {
            const alreadyExistError = (injectIntlTranslation(intl, "CopySelectionAlreadyExists")).replace('_SELECTIONNAME_', "\"" + TagName + "\"");
            dispatch && dispatch(showErrorNotification(alreadyExistError));
        }
        else {
            const genericError = injectIntlTranslation(intl, "GenericErrorMessage");
            dispatch && dispatch(showErrorNotification(genericError));
        }
        throw error(error)
    }
}

export const copyTagMethod = (copyTagActionProps, index) => {
    return new Promise(async (resolve, reject) => {
        const { TagId, TagName, newProjectId, isCopytoAnotherProject = false, OldTagId } = copyTagActionProps;
        const jsonData = {
            newTagName: TagName,
            tagId: TagId,
            projectId: newProjectId
        };
        try {
            const apiUrl = `${appConfig.api.eCatApimAppService}${endPoints.POST_COPY_SELECTIONS}newTagName=${TagName}&tagId=${TagId}&projectId=${newProjectId}&isCopytoAnotherProject=${isCopytoAnotherProject}`;
            const response = await ApiService(apiUrl, 'POST', jsonData);
            resolve(response)
        }
        catch(error) {
            resolve({data: {duplicateError: true }})
        }
    })
}

