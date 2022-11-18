import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from "react-intl";
import { ConfirmModal, translation, AddProject } from '@carrier/ngecat-reactcomponents';
import { launchSelectionFlow } from '../../../redux/Actions/launchSelectionFlow';
import AddProjectDialogFooter from './addProjectDialogFooterComponent';
import { getUserCustomers, createNewProjectReducer, showSuccessNotification, resetProjectErrorStatus, injectIntlTranslation, refreshProjectList } from '@carrier/workflowui-globalfunctions';

const AddProjectDialog = (props) => {
    const { userCustomers, getUserCustomers,
        createNewProjectReducer, launchSelectionFlow, showSuccessNotification, intl, editProject, toggleprojectDialog
        , openDialog, projectId = "", customerID = "", disableProjectName } = props;

    const constructProjectObject = (value) => {
        const { customerID = "", projectName = "", projectId = "", customerName = "", companyName = "", customerEmail = "", customerPhone = "" } = value;
        const project = {
            ProjectName: { id: "ProjectName", value: projectName, isDisabled: disableProjectName || false },
            CustomerName: { id: "CustomerName", value: customerName },
            ContactName: { id: "ContactName", value: companyName, isDisabled: true },
            ContactEmail: { id: "ContactEmail", value: customerEmail, isDisabled: true },
            ContactNumber: { id: "ContactNumber", value: customerPhone, isDisabled: true },
            CustomerID: customerID,
            ProjectId: projectId
        };
        return project;
    }
    const [disableSave, setdisableSave] = useState(true);
    const [error, seterror] = useState('');
    const [Project, setProject] = useState(constructProjectObject(props));
    
    useEffect(() => {
        getUserCustomers();
        return () => resetProjectErrorStatus()
    }, [getUserCustomers]);

    const saveHandler = () => {
        createProject(false);
    }

    const saveAndAddSelectionHandler = (workflow, childWorkflow, history) => {
        createProject(true, workflow, childWorkflow, history);
    }

    const createProject = (isCreateSelection, workflow = {}, childWorkflow = {}, history = {}) => {
        setdisableSave(true);
        createNewProjectReducer(
            Project.ProjectId,
            Project.ProjectName.value,
            Project.CustomerId,
            Project.CustomerName.value,
            Project.ContactName.value,
            Project.ContactNumber.value,
            Project.ContactEmail.value,
            result => {
                if (result.ECatCode) {
                    setdisableSave(false);
                    seterror(injectIntlTranslation(intl, result.Message[0]));
                }
                else {
                    setdisableSave(true);
                    toggleprojectDialog();
                    let ProjectSaveSuccessMessagemsg = (injectIntlTranslation(intl, "ProjectSaveSuccessMessage")).replace('_PROJECTNAME_', "\"" + Project.ProjectName.value + "\"");
                    showSuccessNotification(ProjectSaveSuccessMessagemsg);
                    if (isCreateSelection) {
                        const projectDetails = { route: "From selection", ProjectName: result.ProjectName, ProjectID: result.ProjectID };
                        launchSelectionFlow({ workflow, childWorkflow, history, projectDetails });
                    }
                }
            }
        );
    }

    const UpdateProjectInfo = ({ projectInfo, disableSave, customerId }) => {
        setProject({ ...projectInfo, CustomerId: customerId, ProjectId: projectId });
        setdisableSave(disableSave);
    }

    const createSaveProjectButtons = () => {
        return (
            <AddProjectDialogFooter
                saveHandler={saveHandler}
                disableSave={disableSave}
                saveAndAddSelectionHandler={saveAndAddSelectionHandler}
                editProject={editProject}
            />
        );
    }

    return (
        <ConfirmModal
            isModalOpen={openDialog}
            title={!editProject ? translation("NewProject") : translation("EditProject")}
            fullWidth
            hideCancel
            errorMsg={error}
            onClose={toggleprojectDialog}
            footerComponent={createSaveProjectButtons()}
        >
            <AddProject
                customerNameList={userCustomers}
                updateProjectInfo={UpdateProjectInfo}
                projectName={!editProject ? {} : Project.ProjectName}
                customerName={Project.CustomerName}
                contactName={Project.ContactName}
                contactEmail={Project.ContactEmail}
                contactNumber={Project.ContactNumber}
                defaultCustomerID={customerID}
            />
        </ConfirmModal>
    )
}

const mapStateToProps = (state) => ({
    userCustomers: state.getUserCustomers.records,
});

export default injectIntl(connect(mapStateToProps, { getUserCustomers, createNewProjectReducer, resetProjectErrorStatus, showSuccessNotification, launchSelectionFlow, refreshProjectList })(AddProjectDialog));
