import React from 'react';
import appConfig from '../../Environment/environments';
import {
    ApiService, endPoints, injectIntlTranslation, showSuccessNotification, updateOrAddToAssignment,
    showErrorNotification, tagGridColumn, refreshProjectList, getTagData, parseJsonIfNotEmpty
} from "@carrier/workflowui-globalfunctions";
import { refreshTagGrid } from "./getTagList";
import { TAG_UPDATING, TAG_UPDATED } from "../constants/constant"
import { getChildWorkFlowDetails } from "../../components/projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil";
import TagLockDeleteError from "../../components/common/controls/notification/TagLockDeleteErrorNotification";

export const updateTagName = (tagobj, editedValue, rowIndex, intl) => (dispatch, getState) => {
    const successMessage = (injectIntlTranslation(intl, "UpdateSelectionNameSuccessMessage")).replace('_SELECTIONNAME_', "\"" + editedValue + "\"");
    const errorMessage = injectIntlTranslation(intl, "GenericErrorMessage");
    updateTag({ getState, dispatch, tagobj, editedValue, rowIndex, successMessage, errorMessage, columnToUpdate: tagGridColumn.SelectionName, intl });
};

export const updateTagQuantity = (tagobj, editedValue, rowIndex, intl) => (dispatch, getState) => {
    const { getAllProductsReducer: { builderList } } = getState();
    const { childrenWorkflow, workflow } = workflowDetails(tagobj, builderList);
    const { tagQuantityHandler = {} } = childrenWorkflow;
    const { tagQuantityHandler: workflowTagUpdateHandler = {} } = workflow;
    const postHandler = tagQuantityHandler.postAction || workflowTagUpdateHandler.postAction
    const updateConfiguration = tagQuantityHandler.updateConfiguration || workflowTagUpdateHandler.updateConfiguration || {}
    const successMessage = (injectIntlTranslation(intl, "UpdateQuantitySuccessMessage")).replace('_SELECTIONNAME_', "\"" + tagobj.TagName + "\"");
    const errorMessage = injectIntlTranslation(intl, "GenericErrorMessage");
    updateTag({ getState, dispatch, tagobj, editedValue, rowIndex, successMessage, errorMessage,
        columnToUpdate: tagGridColumn.Quantity, intl, postHandler, childrenWorkflow, workflow, updateConfiguration });
};

export const updateTagComment =  (tagobj, editedValue, rowIndex, intl) => (dispatch, getState) => {
    const successMessage = (injectIntlTranslation(intl, "TagUpdateSuccessMessage"));
    let newXML =  updateXMLAttribute(tagobj.TagInformation, editedValue)
    const errorMessage = injectIntlTranslation(intl, "GenericErrorMessage");
    updateTag({ getState, dispatch, tagobj, editedValue:newXML, rowIndex, successMessage, errorMessage,
        columnToUpdate: tagGridColumn.TagInformation, intl });
};

const updateXMLAttribute = (xmlInput, attributeValue) => {
    if(!xmlInput.trim().length){
        return `<Tag><StandardInformation><Comment>${attributeValue}</Comment></StandardInformation></Tag>`
    }else if(xmlInput.includes("<StandardInformation>") && !xmlInput.includes("<Comment>")){
        let newXMLString = `<Tag>${xmlInput}`
        return newXMLString.replace("</StandardInformation>", `<Comment>${attributeValue}</Comment></StandardInformation></Tag>`)
    }else if(xmlInput.includes("<StandardInformation>") && xmlInput.includes("<Comment>")){
        let newXMLString = `<Tag>${xmlInput}</Tag>`
        return newXMLString.replace(/(<Comment\b[^>]*>)[^<>]*(<\/Comment>)/i, `<Comment>${attributeValue}</Comment>`)
    }
}

const workflowDetails = (tagobj, builderList) => {
    const { TagModel, ProductBuilder: Builder } = tagobj || {};
    return getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderList);
}

const updateTag = async ({ getState, dispatch, tagobj, editedValue, rowIndex, successMessage, errorMessage,
    columnToUpdate, intl, postHandler, childrenWorkflow, workflow, updateConfiguration = {} }) => {

    const inProgressMessage = (injectIntlTranslation(intl, "TagUpdateInProgressMessage"));
    dispatch(showSuccessNotification(inProgressMessage, true, true))
    
    const { SelectionName, Quantity } = tagGridColumn;
    let jsonData = [{
        TagId: tagobj.TagId,
        Data: {
            Tags: {
                Columns: [{
                    TagId: tagobj.TagId,
                    [SelectionName]: tagobj[SelectionName],
                    [Quantity]: tagobj[Quantity],
                    ProjectId: tagobj.ProjectId
                }]
            }
        }
    }];

    
    if (updateConfiguration) {
        const { propertyName } = updateConfiguration;
        if (propertyName) {
            const { api: { eCatApimAppService } } = getState();
            const baseUrl = `${eCatApimAppService}${endPoints.GET_TAG_INFORMATION}`;
            const res = await getTagData(baseUrl, tagobj.TagId, 'TagConfigurations', ['ConfigurationInputXml'])
            const {ConfigurationInputXml} = res.data.TagConfigurations;
            let assignment = parseJsonIfNotEmpty(ConfigurationInputXml)
            updateOrAddToAssignment(assignment, propertyName, editedValue)
            jsonData[0].Data.TagConfigurations = {
                Columns: [{
                    TagId: tagobj.TagId,
                    ConfigurationInputXml: `${JSON.stringify(assignment)}`,
                }]
            };
        }
    }
    
    jsonData[0].Data.Tags.Columns[0][columnToUpdate] = editedValue;
    
    try {
        await ApiService(`${appConfig.api.eCatApimAppService}${endPoints.UPDATE_TAG}`, 'POST', jsonData);
        if (postHandler) {
            await postHandler({tagobj, editedValue, childrenWorkflow, workflow, api: appConfig.api})
        }
        dispatch(refreshTagGrid())
        dispatch({ type: TAG_UPDATED })
        dispatch(showSuccessNotification(successMessage))
        dispatch(refreshProjectList())
    }
    catch (error) {
        dispatch({ type: TAG_UPDATED })
        if (error.response.status === 409) {
            const { ErrorCode } = JSON.parse(error.response.data)
            let errorMsg;
            if (ErrorCode === 1001) {
                errorMsg = injectIntlTranslation(intl, "Valid_Role_Share_Project")
            }
            else if (ErrorCode === 1003) {
                const message = (
                    <div>
                        <span id="names">{tagobj[SelectionName]  + " "}</span>
                        <span>{injectIntlTranslation(
                            intl,
                            "CouldNotModify"
                        )}</span>
                    </div>
                );
                const subMessage = injectIntlTranslation(intl, "TheTagIsInEdit");
                errorMsg = <TagLockDeleteError intl={intl} message={message} subMessage={subMessage} />
            }
            else {
                errorMsg = (injectIntlTranslation(intl, "TagNameAlreadyExists")).replace('_TAGNAME_', "\"" + editedValue + "\"");
            }
            dispatch(showErrorNotification(errorMsg))
        }
        else {
            dispatch(showErrorNotification(errorMessage))
        }
    }
}

export const tagUpdating = () => (dispatch) => {
    dispatch({ type: TAG_UPDATING })
}
