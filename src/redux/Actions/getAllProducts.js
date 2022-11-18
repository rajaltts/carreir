import {
    UPDATE_BUILDER_LIST_WITH_PERMISSION,
    UPDATE_ALL_BUILDER_ROUTES } from '../constants/constant';
import workflowsConfig from '../../components/WorkflowsConfig';

export const updateBuilderPermission = (builderPermission) => (dispatch) => {
    if (builderPermission) {
        workflowsConfig.forEach((workflow, index, workflowsConfig) => {
            const builderIndex = builderPermission.childSettings.findIndex((builder) => builder.settingName === workflow.settingName);
            if (builderIndex >= 0) {
                workflowsConfig[index].hasPermission = true;
            } else {
                workflowsConfig[index].hasPermission = false;
            }
            if (workflow.childrenWorkflow && !!workflow.childrenWorkflow.length) {
                workflow.childrenWorkflow.forEach((childrenWorkflow, childrenIndex) => {
                    if (builderIndex >= 0) {
                        const childrenBuilderIndex = builderPermission.childSettings[builderIndex].childSettings.findIndex((childBuilder) => 
                            childBuilder.settingName === childrenWorkflow.settingName
                        );
                        if (childrenBuilderIndex >= 0) {
                            workflowsConfig[index].childrenWorkflow[childrenIndex].hasPermission = true;
                        } else {
                            workflowsConfig[index].childrenWorkflow[childrenIndex].hasPermission = false;
                        }
                    } else {
                        workflowsConfig[index].childrenWorkflow[childrenIndex].hasPermission = false;
                    }
                })
            }
        });
    }
    dispatch({ type: UPDATE_BUILDER_LIST_WITH_PERMISSION, data: {builderList: workflowsConfig}});
 }

 export const updateAllBuilderRoutes = (allBuilderRoutes) => (dispatch) => {
    dispatch({ type: UPDATE_ALL_BUILDER_ROUTES, data: allBuilderRoutes});
 }