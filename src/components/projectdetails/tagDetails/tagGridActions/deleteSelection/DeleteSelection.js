import React, { useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { translation } from '@carrier/ngecat-reactcomponents';
import CustomButton from '../../../../common/controls/CustomButton';
import { connect } from "react-redux";
import { deleteMultipleTag } from './../../../../../redux/Actions/tagActions/deleteAction'
import { injectIntl } from "react-intl";
import { tagGridActionsStyles } from './../../tagGrid/TagGridStyles'
import ConfirmDialog from '../../../../common/controls/confirmDialog/ConfirmDialog';
import { injectIntlTranslation, showLoader, isProjectAdminOrOwner } from "@carrier/workflowui-globalfunctions";
import ContentWithScroll from '../../../../common/controls/confirmDialog/DialogContentTemplates/ContentWithScroll';
import { getLoaderText } from "../../tagGrid/tagActions/TagActionUtil";

function DeleteSelection(props) {
    const { selectedTagData, intl, deleteMultipleTag, showLoader, userProjectRole } = props
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModalDialogue = () => {
        if (!!selectedTagData.length) {
            setIsModalOpen(true)
        }
    }

    const closeDialog = () => {
        setIsModalOpen(false)
    }

    const onClickDeleteSelection = () => {
        if (!!selectedTagData.length) {
            showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, "DeleteSelections")}), false);
            deleteMultipleTag({ selectedTagData, intl });
            setIsModalOpen(false)
        }
    }

    const createDeleteProjectMessage = () => {
        let tags = selectedTagData.map(x => x.TagName).join(",");
        return { primaryText: injectIntlTranslation(intl, "DeleteSelectionConfirmationText") + " :", secondaryText: tags }
    }

    const { rightAlign } = tagGridActionsStyles()

    const isDisabled = () => {
        if (!selectedTagData.length || !isProjectAdminOrOwner(userProjectRole)) {
            return true
        }
        return false
    }

    return (
        <div className={rightAlign}>
            <CustomButton
                name={translation("DeleteSelections")}
                disabled={isDisabled()}
                id="DeleteSelections"
                iconProps={{ icon: faTrashAlt }}
                showDropdownIcon={false}
                onClick={openModalDialogue}
            />

            <ConfirmDialog
                openDialog={isModalOpen}
                onClick={onClickDeleteSelection}
                onClose={closeDialog}
            >
                <ContentWithScroll content={createDeleteProjectMessage()} />
            </ConfirmDialog>
        </div>
    )
}

const mapStateToProps = (state) => ({
    selectedTagData: state.tagList.selectedTags,
    userProjectRole: state.createNewProject.projectData.UserRole,
});

export default injectIntl(connect(mapStateToProps, { deleteMultipleTag, showLoader })(DeleteSelection))
