import React, { memo } from "react";
import ProjectActionComponent from "../projectActionComponent";
import { connect } from "react-redux";
import { duplicateProjectAction } from "../../../../../redux/Actions/projectListActions/duplicateProject";
import { injectIntl } from "react-intl";
import { injectIntlTranslation, showLoader } from '@carrier/workflowui-globalfunctions';
import { getLoaderText } from '../../../.././projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil';


const DuplicateProject = (props) => {
  const { closeDropdown, projectData, duplicateProjectAction, intl, isProjectOwner,showLoader } = props;

  const onClickHandler = () => {
    showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, "DuplicateProject")}), false);
    duplicateProjectAction({ projectData, intl });
  };

  return (
    <ProjectActionComponent
      name={"DuplicateProject"}
      projectData={projectData}
      onClick={onClickHandler}
      closeDropdown={closeDropdown}
      id="DuplicateProject"
      disabled={!isProjectOwner}
    />
  );
};

export default injectIntl(
  connect(null, { duplicateProjectAction, showLoader })(memo(DuplicateProject))
);
