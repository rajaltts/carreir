import { getWorkflowDetails, injectIntlTranslation } from "@carrier/workflowui-globalfunctions";

const getChildWorkFlowDetails = (item, childrenWorkflowName, workflowsConfig) => {
    if (!item) {
        return {};
    }
    const { workflowId, SelectedModelId: childrenWorkflowId } = item;
    const result = getWorkflowDetails({
        workflowsConfig,
        workflowId,
        childrenWorkflowId,
        childrenWorkflowName,
        useSettingName: true
    });
    return result || {};
}

const getLoaderText = ({title, intl}) => {
    return injectIntlTranslation(intl, "IN_PROGRESS").replace('_ACTION_', title);
}

export { getChildWorkFlowDetails, getLoaderText };