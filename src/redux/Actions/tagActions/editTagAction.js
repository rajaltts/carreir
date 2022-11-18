import {
    getTagDetailInfo, breadcrumbText, getFullUrl, actionConstants,
    getTagInfo, isEmptyObject, getTagIdFromUrl, getProjectIdFromUrl,
    getWorkflowDetailsForRoute, showErrorNotification
} from "@carrier/workflowui-globalfunctions";
import { translation } from '@carrier/ngecat-reactcomponents';
import { getChildWorkFlowDetails } from "../../../components/projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil";

export const tagEdit = (tagData, isSelection, SelectionColumn, history, isFixConfiguration = false, isMultiTag) => (dispatch, getState) => {
    const { getAllProductsReducer: { builderList }, createNewProject: { projectData } } = getState();
    const { TagModel, ProductBuilder: Builder, TagId, TagName, ProjectId } = tagData;
    const { ProjectName } = projectData;
    const workflowDetails = getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderList);
    const option = isSelection ? workflowDetails.launchUrlDetails.selection : workflowDetails.launchUrlDetails.configuration
    if (option || option.url) {
        dispatch({
            type: actionConstants.PROJECT_DETAILS_UPDATE,
            data: projectData,
        });
        dispatch({
            type: actionConstants.TAG_DETAILS_UPDATE,
            data: tagData
        });
        dispatch(getTagDetailInfo({ TagId, SelectionColumn }));
        let urlToNavigate = getFullUrl(history.location, option, (isMultiTag) ? { ProjectId, ProjectName, IsMultiTag: isMultiTag } : { ProjectId, ProjectName }, { TagId, TagName });
        if (isFixConfiguration) {
            urlToNavigate = `${urlToNavigate}&${breadcrumbText.isFixConfiguration}=true`
        }
        history.push(urlToNavigate);
    }
}

export const fetchAndUpdateTagDetails = () => (dispatch, getState) => {
    try {
        const {
            getAllProductsReducer: { builderList }, createNewProject: { projectData },
            getProjectList: { records },
            tagDetailInformation: { tagDetails, selectionData, configurationData, performanceData, isLoading, projectDetails }
        } = getState();
        const tagID = getTagIdFromUrl()
        const projectID = getProjectIdFromUrl()
        if (tagID && projectID && !isLoading) {
            const { workflow, childrenWorkflow } = getWorkflowDetailsForRoute(builderList, { pathname: window.location.pathname })
            const { tagDetailsInfo } = workflow?.launchUrl?.selection || childrenWorkflow?.launchUrl?.selection
            const { enable = false, selectionColumn = null } = tagDetailsInfo || {}
            if (enable) {
                const projectInfo = records.find(record => record.ProjectID === projectID)
                isEmptyObject(projectDetails) && dispatch({ type: actionConstants.PROJECT_DETAILS_UPDATE, data: projectInfo });
                isEmptyObject(projectData) && dispatch({ type: actionConstants.FETCH_ADDPROJECT_FULFILLED, data: projectInfo });
                isEmptyObject(tagDetails) && dispatch(getTagInfo(tagID));
                (isEmptyObject(selectionData) && isEmptyObject(configurationData) && isEmptyObject(performanceData)) && dispatch(getTagDetailInfo({ TagId: tagID, SelectionColumn: selectionColumn }));
            }
        }
    }
    catch (error) {
        dispatch(showErrorNotification(translation("GenericErrorMessage")));
    }
}