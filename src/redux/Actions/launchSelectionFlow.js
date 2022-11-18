import { getInitialSelectionLoadData } from '../Actions/NaActions/Selection/selectionLoadAction';
import { getFullUrl, actionConstants } from "@carrier/workflowui-globalfunctions";

export const launchSelectionFlow = ({ workflow = {}, childWorkflow = {}, history, projectDetails = {} }) => (dispatch) => {
    const launchUrl = childWorkflow.launchUrl || workflow.launchUrl;
    if (launchUrl) {
        const { selection } = launchUrl;
        const { url, preDataFetch, templateInfo } = selection;
        if (url) {
            dispatch({
                type: actionConstants.PROJECT_DETAILS_UPDATE,
                data: projectDetails,
            });
            if (preDataFetch) {
                dispatch(getInitialSelectionLoadData(preDataFetch));
            }
            const fullUrl = getFullUrl(history.location, selection, getProjectDetails(projectDetails), {}, templateInfo)
            history.push(`${fullUrl}`, {
                Id: childWorkflow.id || '',
                Builder: workflow.id,
                FullName: getFullName(workflow, childWorkflow),
                Name: childWorkflow.displayName || '',
                ...projectDetails
            });
        }
    }
};

const getFullName = (workflow, childWorkflow) => {
    if (childWorkflow.displayName) {
        return `${workflow.displayName} (${childWorkflow.displayName})`
    }
    return workflow.displayName;
}

const getProjectDetails = (projectDetails) => {
    if (projectDetails.ProjectID) {
        return { ProjectId: projectDetails.ProjectID, ProjectName: projectDetails.ProjectName };
    }
    return projectDetails;
}