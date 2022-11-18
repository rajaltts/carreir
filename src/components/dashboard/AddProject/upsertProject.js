import React, { useState } from 'react';
import { injectIntl } from "react-intl";
import { translation } from '@carrier/ngecat-reactcomponents';
import CustomButton from '../../common/controls/CustomButton'
import AddIcon from '@material-ui/icons/Add';
import AddProjectDialog from './addProjectDialog';
import { resetProjectErrorStatus } from '@carrier/workflowui-globalfunctions';
import { connect } from 'react-redux';
const UpsertProject = (props) => {
    const { customerID = "", projectName = "", projectId = "", customerName = "", companyName = "",
        customerEmail = "", customerPhone = "", editProject, isOpenDialog = false, toggleDialog , dispatch, 
        disableProjectName } = props;
    const [openDialog, setopenDialog] = useState(isOpenDialog);

    const toggleprojectDialog = () => {
        openDialog && dispatch(resetProjectErrorStatus());
        setopenDialog(!openDialog);
        toggleDialog && toggleDialog(!openDialog);
    }

    return (
        <>
            {!editProject &&
                <CustomButton
                    showGradient
                    name={translation("AddNewProject")}
                    id="AddProject"
                    iconComponenet={<AddIcon />}
                    onClick={toggleprojectDialog}
                />
            }
            {openDialog &&
                <AddProjectDialog
                    editProject={editProject}
                    projectId={projectId}
                    customerID={customerID}
                    customerEmail={customerEmail}
                    customerPhone={customerPhone}
                    customerName={customerName}
                    companyName={companyName}
                    projectName={projectName}
                    openDialog={openDialog}
                    toggleprojectDialog={toggleprojectDialog}
                    disableProjectName={disableProjectName || false}
                />}
        </>
    )
}

export default injectIntl(connect(null,null)(UpsertProject));
