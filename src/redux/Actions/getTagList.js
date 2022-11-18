import appConfig from '../../Environment/environments';
import { 
    REFRESH_TAG_GRID, CLEAR_TAG_LIST, GET_TAG_LIST_START, GET_TAG_LIST_FULFILLED, 
    GET_TAG_LIST_FAILED, UPDATE_SELECTED_TAGS_LIST, UPDATE_COLUMN_SETTING,
    TAG_COLUMN_OPTIONS_LOADING_START, TAG_COLUMN_OPTIONS_LOADING_STOP, LOCK_ID_UPDATE,
    LOCK_ID_UPDATE_WITH_WARNING
} from '../constants/constant';
import { getChildWorkFlowDetails } from "../../components/projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil";
import { 
    ApiService, endPoints, tagActionsType, tagGridColumn, tagDataKeys, hideLoader, FilterAndReconfigureVersioned,
    showErrorNotification, getProjectIdFromUrl, isProjectViewer, getTagIdFromUrl, mergeVariableDomainsInProperties,
    getWorkflowDetailsForRoute, checkForBuilderPermission, checkForBuilderRolePermission, parseJsonIfNotEmpty
} from "@carrier/workflowui-globalfunctions";
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import pako from 'pako';
import { translation } from '@carrier/ngecat-reactcomponents';
import workFlowsConfig from '../../components/WorkflowsConfig';

export const updateLockedId = (relock=false) => (dispatch, getState) => updateLockState(dispatch, getState, relock)

const getWorkflowPermission = (role) => {
    const { workflow, childrenWorkflow } = getWorkflowDetailsForRoute(workFlowsConfig, { pathname: window.location.pathname })
    const builderPermission = checkForBuilderPermission(workflow, childrenWorkflow);
    const builderRolePermission = checkForBuilderRolePermission(workflow, childrenWorkflow, role);
    return (builderPermission && builderRolePermission)
}

const updateLockState = async(dispatch, getState, relock) => {
    const lockedID = getTagIdFromUrl()
    const { tagList: { lockedID: oldLockID }, getProjectList: { records }, locale: { role } } = getState();
    const projectID = getProjectIdFromUrl() || ""
    const { UserRole = "", SharedUserList = [] } = records.filter(record => record.ProjectID === projectID)[0] || {};
    const builderHasPermission = lockedID ? getWorkflowPermission(role) : true; 
    if (projectID && !isProjectViewer(UserRole) && !!SharedUserList.length && builderHasPermission) {
        let isLock = false
        let lockId = oldLockID
        if ((lockedID !== oldLockID && lockedID) || relock) {
            isLock = true
            lockId = lockedID
        }
        if (lockId) {
            try {
                dispatch({
                    type: LOCK_ID_UPDATE,
                    data: { resetTimer: false}
                })
                const { data } = await ApiService(`${appConfig.api.eCatApimAppService}${endPoints.LOCK_UPDATE}?tagId=${lockId}&isLock=${isLock}`, 'POST', null, null, null, null)
                const lockedMessage = isLock ? JSON.parse(data) : {...JSON.parse(data), UserName: undefined}
                const result = { lockedID: isLock ? lockedID : "", resetTimer: relock, lockedMessage, checkForTagLockWarning: false }
                dispatch({
                    type: LOCK_ID_UPDATE,
                    data: result
                })
            }
            catch (error) {
                const { code, message } = error?.response?.data || {};
                if (code && code === 403) {
                    dispatch({
                        type: LOCK_ID_UPDATE_WITH_WARNING,
                        data: {
                            lockedID: lockedID,
                            lockedMessage: JSON.parse(message),
                            resetTimer: relock,
                            checkForTagLockWarning: relock
                        }
                    })
                }
                else {
                    dispatch(showErrorNotification(translation("GenericErrorMessage")));
                }
            }
        }
    }
}

export const updateMultipleLockState = (tagList, isLock = false) => async(dispatch, getState) => {
    await updateMultipleTagLockState(tagList, isLock, getState)
}

const updateMultipleTagLockState = async (tagData = [], islock = false, getState) => {
    const { getProjectList: { records }} = getState();
    const projectID = getProjectIdFromUrl() || ""
    const { UserRole = "", SharedUserList = [] } = records.filter(record => record.ProjectID === projectID)[0] || {};
    if (projectID && !isProjectViewer(UserRole) && !!SharedUserList.length) {
        const { UIBuilderDetails, GridActions, IsMultiTagEdit, IsValid } = tagDataKeys;
        const tagIdsForLocking = [];
        tagData.forEach(tag => {
            if (tag[UIBuilderDetails][GridActions][IsMultiTagEdit][IsValid]) {
                tagIdsForLocking.push(tag.TagId)
            }
        })

        if (!!tagIdsForLocking.length) {
            const tagLockResponse = await ApiService(
                `${appConfig.api.eCatApimAppService}${endPoints.BATCH_LOCK_UPDATE}`,
                'post', 
                {
                    "islock": islock,
                    "tagIds": tagIdsForLocking
                }
            );
            return tagLockResponse;
        }
    }
    return { data: []}
}

export const getTagList = (ProjectId, isMultiTag = false) => async (dispatch, getState) => {
    const { getAllProductsReducer: { builderList }, locale, userProfile: { fullName } } = getState();
    dispatch({ type: GET_TAG_LIST_START })
    const getTagConfigDataPromise = getMultiTagData(ProjectId, isMultiTag);
    const getTagPromise = getTagListData(ProjectId)
    Promise.all([getTagConfigDataPromise, getTagPromise])
    .then(async ([configDataObj, res]) => {
        let updatedTagData = updateTagData(res.data, builderList, locale, configDataObj);
        if (isMultiTag) {
            updatedTagData = await updateConfigurationRulesData(updatedTagData)
            const lockReponse = await updateMultipleTagLockState(updatedTagData, true, getState)
            lockReponse.data.forEach(resItem => {
                const item = JSON.parse(resItem);
                if (item["ErrorDetails"]) {
                    const index = updatedTagData.findIndex(tagItem => tagItem.TagId === item.TagId);
                    if (index >= 0) {
                        updateMultiTagGridAction(updatedTagData[index], item.UserName === fullName)
                    }
                }
            })
        }
        dispatch({
            type: GET_TAG_LIST_FULFILLED,
            data: updatedTagData
        });
        dispatch(hideLoader());
    })
    .catch(error => {
        dispatch({
            type: GET_TAG_LIST_FAILED,
            data: error
        })
        dispatch(hideLoader());
    });
}

export const getTagListData = (ProjectId) => {
    return ApiService(`${appConfig.api.eCatApimAppService}${endPoints.GET_TAG_LIST}`, 'get', null, null, null, { ProjectId });
}

export const refreshTagGrid = () => (dispatch) => {
    dispatch({ type: REFRESH_TAG_GRID })
}

export const clearTagsList = () => (dispatch) => {
    dispatch({ type: CLEAR_TAG_LIST })
}

export const updateSelectedTagsList = (selectedRows) => (dispatch) => {
    dispatch({ type: UPDATE_SELECTED_TAGS_LIST, data: selectedRows })
}

const getXmlData = (tag) => {
    let xmlDoc = null;
    const parser = new DOMParser();
    const {  CRMReference, Price, Comment } = tagGridColumn;
    xmlDoc = parser.parseFromString(tag.TagInformation, "text/xml");
    const xmlObj = {
        chillerArrange: xmlDoc.getElementsByTagName("ChillerArrange")[0] ? `${(xmlDoc.getElementsByTagName("ChillerArrange")[0].innerHTML)}` : "N/A",
        chillerCoolingCapacity: xmlDoc.getElementsByTagName("ChillerCoolingCapacity")[0] ? `${(xmlDoc.getElementsByTagName("ChillerCoolingCapacity")[0].innerHTML)}`:"N/A",
        cRMReference: xmlDoc.getElementsByTagName(CRMReference)[0] ? `${(xmlDoc.getElementsByTagName(CRMReference)[0].innerHTML)}` : "N/A",
        price: xmlDoc.getElementsByTagName(Price)[0] ? `${(xmlDoc.getElementsByTagName(Price)[0].innerHTML)}` : "N/A",
        comment: xmlDoc.getElementsByTagName(Comment)[0] ? `${(xmlDoc.getElementsByTagName(Comment)[0].innerHTML)}` : "N/A"
    };
    return xmlObj;
};

const updateTagData = (tagsData, builderList, locale, configDataObj) => {
    const tagList = tagsData.Tags.map((tagData) => {
        const xmlData = getXmlData(tagData);
        const { chillerArrange, chillerCoolingCapacity, cRMReference, price, comment  } = xmlData;
        const { workflow, childrenWorkflow } = getChildWorkFlowDetails({ workflowId: tagData.ProductBuilder }, tagData.TagModel, builderList);
        const release = (childrenWorkflow && childrenWorkflow.release) || (workflow && workflow.release) || {};
        const tagDataWithBuilderDetails = getTagDataFromBuilder({ childrenWorkflow, workflow, tagData, release, locale })
        let updatedTag = getOtherColumnData({ tagDataWithBuilderDetails, chillerArrange, chillerCoolingCapacity, release, cRMReference, price, comment })
        if (configDataObj) {
            updatedTag = updateConfigurationInputXmlData(updatedTag, configDataObj);
        }
        return updatedTag;
    });
    return tagList;
};

const getTagDataFromBuilder = ({ childrenWorkflow = {}, workflow = {}, tagData = {}, release, locale }) => {
    const tagDetails = childrenWorkflow.tagDetails || workflow.tagDetails;
    if (tagDetails instanceof Function) {
        return tagDetails({ tagData, childrenWorkflow, workflow, release, locale });
    }
    return tagData;
}

const getOtherColumnData = ({ tagDataWithBuilderDetails, chillerArrange, chillerCoolingCapacity, release, cRMReference, price, comment }) => {
    const { ChillerArrangement, Capacity, CurrentVersion, SVP, CRMReference, Price, Comment } = tagGridColumn;
    getDefaultBuilderDetailsIfNotAvailable(tagDataWithBuilderDetails);
    updateIfNotAvailable(tagDataWithBuilderDetails, ChillerArrangement, chillerArrange);
    updateIfNotAvailable(tagDataWithBuilderDetails, Capacity, chillerCoolingCapacity);
    updateIfNotAvailable(tagDataWithBuilderDetails, CurrentVersion, release.builderVersion);
    updateIfNotAvailable(tagDataWithBuilderDetails, SVP, 'N/A');
    updateIfNotAvailable(tagDataWithBuilderDetails, CRMReference, cRMReference);
    updateIfNotAvailable(tagDataWithBuilderDetails, Price, price);
    updateIfNotAvailable(tagDataWithBuilderDetails, Comment, comment);
    return tagDataWithBuilderDetails;
}

const getDefaultBuilderDetailsIfNotAvailable = (tagData) => {
    const { UIBuilderDetails, TagActions, GridActions, AdditionalDetails } = tagDataKeys;
    if (!isPlainObject(tagData[UIBuilderDetails])) {
        tagData[UIBuilderDetails] = {
            [TagActions]: getDefaultTagActions(),
            [GridActions]: {},
            [AdditionalDetails]: {}
        }
        return tagData;
    }
    if (!isArray(tagData[UIBuilderDetails][TagActions])) {
        tagData[UIBuilderDetails][TagActions] = getDefaultTagActions();
    }
    if (!isPlainObject(tagData[UIBuilderDetails][AdditionalDetails])) {
        tagData[UIBuilderDetails][AdditionalDetails] = {};
    }
    if (!isPlainObject(tagData[UIBuilderDetails][GridActions])) {
        tagData[UIBuilderDetails][GridActions] = {};
    }
    return tagData;
}

const getDefaultTagActions = () => {
    const { Action, Enable } = tagDataKeys;
    return [
        { [Action]: tagActionsType.IsDeleteTag, [Enable]: true },
        { [Action]: tagActionsType.Status, [Enable]: true }
    ];
}

const updateIfNotAvailable = (tagData, columnToUpdate, valueToUpdate) => {
    const { UIBuilderDetails, AdditionalDetails } = tagDataKeys;
    if (tagData[UIBuilderDetails] && tagData[UIBuilderDetails][AdditionalDetails] && tagData[UIBuilderDetails][AdditionalDetails][columnToUpdate]) {
        return tagData;
    }
    tagData[UIBuilderDetails][AdditionalDetails][columnToUpdate] = valueToUpdate;
    return tagData;
}

const updateConfigurationInputXmlData = (updatedTag, configDataObj) => {
    const { UIBuilderDetails, GridActions, TagActions, IsMultiTagEdit, IsValid, Action, Enable } = tagDataKeys;
    updatedTag[UIBuilderDetails].ConfigurationInputXml = configDataObj[updatedTag.TagId]?.ConfigurationInputXml
    updatedTag[UIBuilderDetails].TagConfigurationId = configDataObj[updatedTag.TagId]?.TagConfigurationId
    updatedTag.IsLockedMode = configDataObj[updatedTag.TagId]?.IsLockedMode;

    const multiTagConfig = updatedTag[UIBuilderDetails][GridActions][IsMultiTagEdit]
    if (!multiTagConfig) {
        updatedTag[UIBuilderDetails][GridActions][IsMultiTagEdit] = { [IsValid] : false };
        return updatedTag;
    }
    if (!updatedTag[UIBuilderDetails].ConfigurationInputXml) {
        return updateMultiTagGridAction(updatedTag, false);
    }

    const { IsEditSelection } = tagActionsType;
    const editSelectionConfig = updatedTag[UIBuilderDetails][TagActions].find(item => item[Action] === IsEditSelection)
    if (editSelectionConfig && editSelectionConfig[Enable]) {
        return updateMultiTagGridAction(updatedTag, true);
    }
    return updateMultiTagGridAction(updatedTag, false);
}

export const upsertTagGridColumnSettings = (columnSettings, columnKey) => async (dispatch, getState) => {
    try {
        dispatch({ type: TAG_COLUMN_OPTIONS_LOADING_START })
        const { api: { userManagement, appAcessURl } } = getState();
        let settingValue = [];
        columnSettings.forEach(column => {
            if (column.isSelected) {
                settingValue.push(column.name);
            }
        });
        const apiInput = {
            "AppUrl": appAcessURl,
            "SettingName": columnKey,
            "SettingValue": JSON.stringify(settingValue)
        }
        await ApiService(`${userManagement}${endPoints.POST_USER_PREFERENCE}`, 'post', apiInput, null, null, null);
        dispatch({
            type: UPDATE_COLUMN_SETTING,
            data: {
                value: settingValue,
                key: columnKey
            }
        })
    }
    catch (error) {
        dispatch(showErrorNotification(translation("COLUMN_OPTIONS_FAIL")));
    }
    finally {
        dispatch({ type: TAG_COLUMN_OPTIONS_LOADING_STOP })
    }
}

const getMultiTagData = (ProjectId, isMultiTag) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isMultiTag) {
                const baseUrl = `${appConfig.api.eCatApimAppService}${endPoints.TAG_DETAILS_WITH_LOCK_STATUS}`;
                const postData = [{
                    "projectId": ProjectId,
                    "ReturnConfigInputXml": true,
                    "ReturnIsLockedModeStatus": true
                }]
                const response = await ApiService(baseUrl, 'POST', postData);
                const stringResp = atob(response.data);
                const characterData = stringResp.split('').map(e => e.charCodeAt(0));
                const binaryData = new Uint8Array(characterData);
                const data = pako.inflate(binaryData);
                const base64String = data.reduce((acc, i) => acc += String.fromCharCode.apply(null, [i]), '');
                const parsedData = base64String ? JSON.parse(base64String) : []

                const configDataObj = {};
                parsedData.forEach(item => {
                    const { ConfigurationInputXml, IsLockedMode, TagId, TagConfigurationId } = item
                    configDataObj[TagId] = { ConfigurationInputXml: parseJsonIfNotEmpty(ConfigurationInputXml), IsLockedMode, TagConfigurationId };
                })
                resolve(configDataObj)
            } else {
                resolve(false)
            }
        }
        catch (error) {
            reject(error)
        }
    })
}
export const getTagReadonlyColumns = (tagData)=> {
  const { UIBuilderDetails, GridActions, IsMultiTagEdit } = tagDataKeys;
  const { configuration = {}} = tagData[UIBuilderDetails][GridActions][IsMultiTagEdit]
  let selectedModelConfig = false;
  for (const item of configuration.models) {
      if (item.model.includes(tagData.TagModel)) {
          selectedModelConfig = item
      }
  }
  if (!selectedModelConfig) return updateMultiTagGridAction(tagData, false);
  const { columns = [] } = selectedModelConfig
  let newCols = columns.filter(item =>item.readonly === 'TRUE').map(item => item.columnName);
  return newCols
}

export const updateConfigurationRulesData = async (updatedTagData, propertiesChanged = [], tagModel = null, setIsValid = true) => {
    const { UIBuilderDetails, GridActions, IsMultiTagEdit } = tagDataKeys;
    return await Promise.all(updatedTagData.map(async tagData => {
        const { enable = false, configuration = {}, isValid = false } = tagData[UIBuilderDetails][GridActions][IsMultiTagEdit]
        if (enable && isValid && configuration.models && !!configuration.models.length) {
            let selectedModelConfig = false;
            for (const item of configuration.models) {
                if (item.model.includes(tagData.TagModel)) {
                    selectedModelConfig = item
                }
            }
            if (!selectedModelConfig) return updateMultiTagGridAction(tagData, false, setIsValid);
            const { tags = null, targetProperties = null, ProductLine = '', ruleSet = '' } = selectedModelConfig
            try {
                const response = await FilterAndReconfigureVersioned(
                    appConfig.api.rulesEngineApi,
                    4,
                    ProductLine,
                    tagModel || tagData.TagModel,
                    tags,
                    targetProperties,
                    tagData[UIBuilderDetails].ConfigurationInputXml,
                    Object.keys(propertiesChanged)
                )
                tagData[UIBuilderDetails].ConfigurationRulesData = response
                tagData[UIBuilderDetails].ConfigurationRulesData.VariableDomains = mergeVariableDomainsInProperties({}, response.VariableDomains)
                return updateMultiTagGridAction(tagData, true, setIsValid)
            }
            catch(error) {
                if (!tagData[UIBuilderDetails].ConfigurationRulesData) {
                    tagData[UIBuilderDetails].ConfigurationRulesData = {}
                }
                return updateMultiTagGridAction(tagData, false, setIsValid)
            }
        } else {
            return updateMultiTagGridAction(tagData, false, setIsValid)
        }
    }));
}

const updateMultiTagGridAction = (tagData, isValid, setIsValid=true) => {
    if (setIsValid) {
        const { UIBuilderDetails, GridActions, IsMultiTagEdit, IsValid } = tagDataKeys;
        tagData[UIBuilderDetails][GridActions][IsMultiTagEdit][IsValid] = isValid;
    }
    return tagData;
}