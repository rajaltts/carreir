import React, { memo } from 'react';
import ConfirmDialog from "../../../../../../common/controls/confirmDialog/ConfirmDialog";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { deleteTag } from '../../../../../../../redux/Actions/tagActions/deleteAction';
import { injectIntlTranslation, showLoader } from '@carrier/workflowui-globalfunctions';
import SimpleContent from '../../../../../../common/controls/confirmDialog/DialogContentTemplates/SimpleContent';
import { getLoaderText } from "../../TagActionUtil";

const DeleteConfirmation = (props) => {
    const { deleteTag, openDialog = true, hideComponent = () => { },
        dataItem: tagData, intl, showLoader } = props;
    const title = "SelectionModelTitle";

    const onDeleteClick = () => {
        hideComponent();
        showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, title)}), false);
        deleteTag({ tagData, intl });
    }

    const createDeleteProjectMessage = () => {
        return { primaryText: injectIntlTranslation(intl, "DeleteSelectionConfirmationText"), secondaryText: tagData.TagName + ' ?' }
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

export default injectIntl((connect(null, { deleteTag, showLoader })(memo(DeleteConfirmation))));