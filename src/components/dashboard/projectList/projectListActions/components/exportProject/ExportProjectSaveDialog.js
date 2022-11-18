import React, { memo } from 'react';
import { ConfirmModal } from '@carrier/ngecat-reactcomponents';
import { generateCD5 } from "@carrier/workflowui-globalfunctions";

import SimpleContent from '../../../../../common/controls/confirmDialog/DialogContentTemplates/SimpleContent';
import { clearExportedData, showSuccessMessage, showErrorMessage } from '../../../../../../redux/Actions/projectListActions/exportProjectAction';
import SaveIcon from '@material-ui/icons/Save'
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";

const ExportProjectSaveDialog = (props) => {
    const { data, intl, dispatch } = props;

    const onCloseHandler = () => {
        dispatch(clearExportedData());
        showErrorMessage(dispatch, intl)
    }

    const showSaveAsMessage = () => {
        return { primaryText: injectIntlTranslation(intl, "ProjectExportSaveMessage")}
    }

    const saveClickHandler = async (event, browse = false) => {
        const { projectData, apiResponse } = data;
        const { ProjectName } = projectData;
        const fullName = ProjectName + "_" + Math.floor(new Date().getTime() / 1000) + ".E4A";
        try {
            if (browse) {
                const dataToSave = new Blob([apiResponse])
                const opts = {
                    suggestedName: fullName,
                    types: [{
                            description: "File",
                    }]
                }
                const handle = await window.showSaveFilePicker(opts);
                const writable = await handle.createWritable();
                await writable.write(dataToSave);
                await writable.close();
            } else {
                generateCD5(apiResponse, fullName, true);
            }
            showSuccessMessage(dispatch, ProjectName, intl);
        }
        catch (error) {
            showErrorMessage(dispatch, intl)
        }
        finally {
            dispatch(clearExportedData());
        }
    }

    const createActionsButton = () => {
        const actionButton = [{
            id: "Save_Export_Project",
            name: injectIntlTranslation(intl, "Save"),
            onClick: saveClickHandler
        }]
        if (window.showSaveFilePicker) {
            actionButton.push({
                id: "Browse_Project_Button",
                name: injectIntlTranslation(intl, "Browse"),
                onClick: (e) => saveClickHandler(e, true)
            })
        }
        return actionButton;
    }


    return (
        <ConfirmModal
            isModalOpen
            title={injectIntlTranslation(intl, "Download")}
            onClose={onCloseHandler}
            disableCloseIcon
            headerIcon={SaveIcon}
            actionButtonList={createActionsButton()}
        >
            <SimpleContent content={showSaveAsMessage()} />
        </ConfirmModal>
    )
}

const mapStateToProps = (state) => ({
    data: state.createNewProject.projectData
});

export default injectIntl(connect(mapStateToProps, null )(memo(ExportProjectSaveDialog)));