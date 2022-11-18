import React, { memo } from 'react';
import ConfirmDialog from "../../../../../common/controls/confirmDialog/ConfirmDialog";
import { connect } from "react-redux";
import { deleteProjectAction } from '../../../../../../redux/Actions/projectListActions/deleteProject';
import { injectIntlTranslation, showLoader } from '@carrier/workflowui-globalfunctions';
import { injectIntl } from "react-intl";
import SimpleContent from '../../../../../common/controls/confirmDialog/DialogContentTemplates/SimpleContent';
import { getLoaderText } from '../../../../../projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil';

const DeleteConfirmation = (props) => {
    const { deleteProjectAction, openDialog = true, hideComponent = () => { },
        dataItem: projectData, intl, showLoader} = props;

    const onDeleteClick = (event) => {
        showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, "DeleteProject")}), false);
        hideComponent(true, event);
        deleteProjectAction({ projectData, intl });
    }

    const createDeleteProjectMessage = () => {
        return { primaryText: injectIntlTranslation(intl, "DeleteSelectionConfirmationText"), secondaryText: projectData.ProjectName + ' ?' }
    }

    return (
        <ConfirmDialog
            openDialog={openDialog}
            onClick={onDeleteClick}
            onClose={hideComponent}
        >
            <SimpleContent content={createDeleteProjectMessage()} />
        </ConfirmDialog>
    )
}

export default injectIntl((connect(null, { deleteProjectAction, showLoader })(memo(DeleteConfirmation))));