import React from "react";
import appConfig from '../../../Environment/environments';
import {
    ApiService, endPoints, showSuccessNotification,
    showErrorNotification, injectIntlTranslation, refreshProjectList
} from "@carrier/workflowui-globalfunctions";
import { refreshTagGrid } from "../getTagList";
import TagLockDeleteError from "../../../components/common/controls/notification/TagLockDeleteErrorNotification";

export const deleteTag = (deleteTagProps) => (dispatch) => {
    const { tagData, intl } = deleteTagProps
    const { TagId, TagName } = tagData;
    const apiInput = [TagId];
    deleteAction({ apiInput, tagNames: TagName, intl, dispatch });
}

export const deleteMultipleTag = (deleteMultipleProps) => async (dispatch) => {
    const { selectedTagData, intl, callback, doNotRefreshTags = false } = deleteMultipleProps;
    let apiInput = [];
    let tagNames = [];

    selectedTagData.forEach(tagitem => {
        apiInput.push(tagitem.TagId);
        tagNames.push(tagitem.TagName);
    });
    
    await deleteAction({
        apiInput,
        tagNames: tagNames.join(),
        intl,
        dispatch,
        isMultipleDelete: true,
        callback,
        doNotRefreshTags
    });
}

const deleteAction = async (deleteActionProps) => {
    const { apiInput, tagNames, intl, isMultipleDelete = false, dispatch, callback, doNotRefreshTags = false } = deleteActionProps;
    dispatch(showSuccessNotification(injectIntlTranslation(intl, "DeleteSelectionsProgress"), false, true));
    try {
        await ApiService(`${appConfig.api.eCatApimAppService}${endPoints.POST_DELETE_MS_SELECTION}`, 'POST', apiInput);
        !doNotRefreshTags && dispatch(refreshTagGrid());
        let successMessage;
        if (isMultipleDelete) {
            successMessage = (injectIntlTranslation(intl, "SelectionsDeleteSuccessMessage")).replace('_TAGNAMES_', "\"" + tagNames + "\"");
        }
        else {
            successMessage = (injectIntlTranslation(intl, "SelectionDeletionSuccessMessage")).replace('_SELECTIONNAME_', "\"" + tagNames + "\"");
        }
        dispatch(showSuccessNotification(successMessage));
        dispatch(refreshProjectList())
        callback && callback(true)
    }
    catch (error) {
        let failMessage = injectIntlTranslation(intl, "GenericErrorMessage");
        if (error.response.status === 409) {
            const { ErrorCode } = JSON.parse(error.response.data);
            if (ErrorCode === 1003) {
                const tags = isMultipleDelete ? tagNames.split(',').join(", ") : tagNames;
                const message = (
                    <div>
                        <span id="names">{tags + " "}</span>
                        <span>{injectIntlTranslation(
                            intl,
                            "CouldNotRemove"
                        )}</span>
                    </div>
                );
                const subMessage = injectIntlTranslation(intl, isMultipleDelete ? "TheTagsAreInEdit" : "TheTagIsInEdit");
                failMessage = <TagLockDeleteError intl={intl} message={message} subMessage={subMessage} />
            }
        }
        dispatch(showErrorNotification(failMessage));
        callback && callback(false)
    }
}