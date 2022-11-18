import React, { memo, useEffect, useState } from 'react';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { translation, ProjectTagSelection, ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { copyTagProject } from '../../../../../../../redux/Actions/tagActions/copyAction';
import { getProjectList, showLoader, injectIntlTranslation, projectListColumn, sortingOrder } from "@carrier/workflowui-globalfunctions";
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { getLoaderText } from "../../TagActionUtil";
import tagActionComponentStyles from "../../TagActionStyles";

const CopyProjectDialog = (props) => {
  const { hideComponent = () => { }, dataItem: tagData, intl,
    copyTagProject, projectDataList, getProjectList, showLoader, isLoading } = props;
  const title = "Copytoproject";
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [copyDialogData, setCopyDialogData] = useState({});
  const { copyProjectDialog } = tagActionComponentStyles();
  const { ProjectName, LastModifiedDate } = projectListColumn;

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createActionsButton = (isSaveDisabled=true) => {
    return [
      {
        id: "Save",
        name: translation("Save", "Save"),
        icon: faSave,
        onClick: copyProject,
        disabled: isSaveDisabled
      }
    ];
  }

  const fetchProjects = (searchText = '') => {
    getProjectList(1, 100, `${LastModifiedDate}_${sortingOrder.descending}`, ProjectName, searchText);
  }

  const onSearchTextChange = (searchText) => fetchProjects(searchText)

  const updateCopyDialogData = (copyDialogInfo) => {
    const { disableSave=true } = copyDialogInfo
    setIsSaveDisabled(disableSave);
    setCopyDialogData(copyDialogInfo);
  }

  const copyProject = () => {
    const { tagName, projectData } = copyDialogData;
    hideComponent();
    showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, title)}), false);
    copyTagProject({
      tagData,
      tagName,
      newProjectId: projectData.ProjectID,
      intl
    });
  }

  return (
    <ConfirmModal
      isModalOpen={true}
      title={translation(title)}
      onClose={hideComponent}
      hideCancel={false}
      actionButtonList={createActionsButton(isSaveDisabled)}
      fullWidth
      contentClassName={copyProjectDialog}
    >
      <ProjectTagSelection
        onClose={hideComponent}
        onSaveTagData={updateCopyDialogData}
        projectDataList={projectDataList}
        intl={intl}
        onSearchTextChange={onSearchTextChange}
        isLoading={isLoading}
      />
    </ConfirmModal>
  )
}
const mapStateToProps = (state) => ({
  projectDataList: state.getProjectList.records,
  isLoading: state.createNewProject.isLoading
});

export default injectIntl((connect(mapStateToProps, { getProjectList, copyTagProject, showLoader })(memo(CopyProjectDialog))));