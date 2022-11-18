import React, { memo } from 'react';
import { ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { injectIntlTranslation } from '@carrier/workflowui-globalfunctions';
import { injectIntl } from "react-intl";
import confirmDialogStyles from "./ConfirmDialogStyles";
import DeleteIcon from '@material-ui/icons/Delete';

const ConfirmDialog = (props) => {
    const { openDialog = true, title = injectIntlTranslation(props.intl, "Warning"), onClose = () => { }, onClick = () => { },
        confirmText = injectIntlTranslation(props.intl, "TagTemplateDelete"), children, headerIcon = DeleteIcon } = props;
    const { confirmContainer } = confirmDialogStyles();

    const createActionsButton = () => {
        return [{
            id: "Yes_Deletetag",
            name: confirmText,
            onClick: onClick
        }];
    }
    
    return (
        <ConfirmModal
            isModalOpen={openDialog}
            title={title}
            onClose={onClose}
            disableCloseIcon
            headerIcon={headerIcon}
            actionButtonList={createActionsButton()}
        >
            <div className={confirmContainer}>
                {children}
            </div>
        </ConfirmModal >
    )
}

export default memo(injectIntl(ConfirmDialog));