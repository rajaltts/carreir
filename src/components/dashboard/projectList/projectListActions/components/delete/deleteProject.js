import React, { memo } from 'react';
import ProjectActionComponent from "../../projectActionComponent";
import DeleteConfirmation from "./deleteConfirmation";
import { injectIntl } from "react-intl";

const Delete = (props) => {
    const { projectData, closeDropdown, isProjectOwner } = props;
    return (
        <ProjectActionComponent
            name={"DeleteProject"}
            projectData={projectData}
            id="ProjectDeletelink"
            closeDropdown={closeDropdown}
            component={DeleteConfirmation}
            disabled={!isProjectOwner}
        />
    )
}

export default injectIntl(memo(Delete));