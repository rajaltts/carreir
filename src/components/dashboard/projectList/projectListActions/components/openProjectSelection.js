import React, { memo } from 'react';
import ProjectActionComponent from "../projectActionComponent";
import { updateProjectData, getFullUrl, breadcrumbText } from '@carrier/workflowui-globalfunctions';
import { connect } from "react-redux";
import { withRouter } from 'react-router';

const OpenProjectSelection = (props) => {
    const { projectData, closeDropdown, updateProjectData, history, location } = props;

    const onClickHandler = () => {
        const { ProjectID, ProjectName, CustomerId, UserRole } = projectData
        updateProjectData({ ProjectID: ProjectID, ProjectName: ProjectName, CustomerID: CustomerId, UserRole: UserRole });
        const url = getFullUrl(
            location,
            { url: `/${breadcrumbText.projectDetail}` },
            { ProjectId: ProjectID, ProjectName: ProjectName }
        );
        history.push(url, { ...projectData });
    }

    return (
        <ProjectActionComponent
            name={"ProjectDetail"}
            projectData={projectData}
            onClick={onClickHandler}
            closeDropdown={closeDropdown}
            id="ProjectDetail"
        />
    )
}

export default withRouter(connect(null, { updateProjectData })(memo(OpenProjectSelection)));