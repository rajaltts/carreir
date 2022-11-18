import React, { memo, useContext } from 'react';
import { ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { injectIntlTranslation } from '@carrier/workflowui-globalfunctions';
import { injectIntl } from "react-intl";
import multiTagHeaderStyles from "./multiTagHeaderStyles";
import SaveIcon from '@material-ui/icons/Save';
import { MultiTagContext } from '../multiTagContext'
const MultiTagConfirmDialog = (props) => {

  const { backToSelectionSummary, setOpenDialog, saveMultiTagList, unlockTags, setCloseMultiTag} = useContext(MultiTagContext);
    const { openDialog = true, title = injectIntlTranslation(props.intl, "SaveChangesTitle"), 
        saveText = injectIntlTranslation(props.intl, "Save"), dontSaveText = injectIntlTranslation(props.intl, "DontSave"), headerIcon = SaveIcon } = props;
    const { confirmContainer, confirmContent } = multiTagHeaderStyles();
    const content = injectIntlTranslation(props.intl, "SaveChangesData");

    const onSaveClick = async () => {
        if (saveMultiTagList) {
            await saveMultiTagList();
            setCloseMultiTag(false)
        }
        await unlockTags()
    }

    const onDontSaveClick = async () => {
        await unlockTags()
        backToSelectionSummary();
    }
    
    const onCloseClick = () => {
        setOpenDialog(false)
    }

    const createActionsButton = () => {
        return [
            {
                id: "Dont_Savetag",
                name: dontSaveText,
                onClick: onDontSaveClick,
                variant: 'outlined',
                color: "#000000"
            },
            {
                id: "Yes_Savetag",
                name: saveText,
                onClick: onSaveClick
            }
        ];
    }

    return (
        <ConfirmModal
            isModalOpen={openDialog}
            title={title}
            onClose={onCloseClick}
            disableCloseIcon
            headerIcon={headerIcon}
            actionButtonList={createActionsButton()}
            contentClassName={confirmContent}
        >
            <div className={confirmContainer}>
                {content}
            </div>
        </ConfirmModal >
    )
}

export default memo(injectIntl(MultiTagConfirmDialog));