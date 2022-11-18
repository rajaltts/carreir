import React, { memo } from 'react';
import OpenProjectSelection from "./components/openProjectSelection";
import ExportProject from "./components/exportProject/ExportProject";
import Delete from "./components/delete/deleteProject";
import DuplicateProject from './components/duplicateProject';
import { isProjectAdminOrOwner, isProjectOwner } from "@carrier/workflowui-globalfunctions";

const ProjectActionsList = (props) => {
    const { rowData: projectData, closeDropdown } = props;

    const createProjectActions = () => {
        const props = {
            projectData,
            closeDropdown,
            isProjectAdminOrOwner: isProjectAdminOrOwner(projectData.UserRole),
            isProjectOwner: isProjectOwner(projectData.UserRole),
        };

        const clickHandler = (event) => {
            event.stopPropagation();
        }

        return (
            <div onClick={clickHandler}>
                <OpenProjectSelection {...props} />
                <ExportProject {...props} />
                <Delete {...props} />
                <DuplicateProject {...props} />
            </div>
        )
    }

    return createProjectActions();
}

export default memo(ProjectActionsList);