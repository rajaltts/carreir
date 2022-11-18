import React, { memo } from 'react';
import ProjectActionComponent from "../../projectActionComponent";
import { exportProjectAction } from '../../../../../../redux/Actions/projectListActions/exportProjectAction';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

const ExportProject = (props) => {
    const { closeDropdown, projectData, intl, exportProjectAction } = props;

    const onClickHandler = () => {
        exportProjectAction(projectData, intl);
    }


    return (
        <ProjectActionComponent
            name={"Download"}
            projectData={projectData}
            onClick={onClickHandler}
            closeDropdown={closeDropdown}
            id="ProjectDownload"
        />
    )
}

export default injectIntl(connect(null, { exportProjectAction })(memo(ExportProject)));