import React, { useEffect, useState } from 'react'
import { SaveTag } from '@carrier/ngecat-reactcomponents'
import { connect } from 'react-redux';
import {
    getUserCustomers, injectIntlTranslation, CloseSaveTag, getProjectList, createNewProjectReducer,
    showErrorNotification, commonConstant, getProjectIdFromUrl, projectListColumn,
    sortingOrder
} from '@carrier/workflowui-globalfunctions';
import { injectIntl } from "react-intl";
import { resetProjectErrorStatus, isProjectViewer } from '@carrier/workflowui-globalfunctions';

const SaveTagDialogue = (props) => {
    const { projectList, userCustomers, saveTag, dispatch, intl, newProject } = props
    const { isModalOpen, saveTagHandler, selectionName } = saveTag
    const { isLoading, error, projectData } = newProject
    const { EMPTY_GUID } = commonConstant;
    const { isLoading: isProjectLoading, records: projectRecords } = projectList
    const { records: customerRecords, customererror, isLoading: isCustomerLoading } = userCustomers
    const [tagName, setTagName] = useState('')
    const [isLoadingData, setIsLoadingData] = useState(false)
    const { ProjectName, LastModifiedDate } = projectListColumn;
    const [errorMessage, setErrorMessage] = useState(error);

    useEffect(() => {
        if (isModalOpen) {
            setIsLoadingData(true)
            if (customerRecords.length === 0) {
                dispatch(getUserCustomers());
            }
            fetchProjects()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    useEffect(() => {
        setErrorMessage(error); 
    }, [error]);

    useEffect(() => {
        if (isModalOpen) {
            if (!(isCustomerLoading || isProjectLoading) && isLoadingData) {
                setIsLoadingData(false)
                if (error !== '') {
                    dispatch(showErrorNotification(injectIntlTranslation(intl, error)))
                }
                else if (customererror !== '') {
                    dispatch(showErrorNotification(injectIntlTranslation(intl, customererror)))
                }
            }
            if (isCustomerLoading || isProjectLoading) {
                setIsLoadingData(true)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, isCustomerLoading, isProjectLoading])

    useEffect(() => {
        if (!isLoading) {
            if (error === '') {
                sendDataToHandler(projectData)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const sendDataToHandler = (projectData, tagname) => {
        if (saveTagHandler) {
            saveTagHandler({
                projectData: projectData,
                tagName: tagname || tagName,
                dispatch,
                message: { successMessage: injectIntlTranslation(intl, "SaveSelectionSuccessMessage_SplitWorkFlowExt") }
            })
        }
    }

    const hideDialogue = () => {
        setTagName('')
        dispatch(resetProjectErrorStatus())
        dispatch(CloseSaveTag());
    }

    const updateTagName = (value) => {
        setTagName(selectionName ? selectionName : value);
    }

    const saveTagDataHandler = ({ exisitingProjectData, newProjectData, selectedTab }) => {
        const { projectData } = exisitingProjectData
        if (!projectData || !projectData?.ProjectID || projectData.ProjectID === EMPTY_GUID) {
            const { ContactEmail, ContactName, ContactNumber, CustomerName, ProjectName, TagName } = newProjectData.projectInfo
            updateTagName((TagName && TagName.value) || exisitingProjectData.tagName || '');
            saveTagHandler && dispatch(createNewProjectReducer(EMPTY_GUID, ProjectName.value, newProjectData.customerId, CustomerName.value, ContactName.value,
                ContactNumber.value, ContactEmail.value))
        } else {
            const { ProjectID, ProjectName, CustomerId, UserRole } = exisitingProjectData.projectData
            if (isProjectViewer(UserRole)) {
                setErrorMessage("Valid_Role_Share_Project");
                return;
            }
            if (errorMessage === injectIntlTranslation(intl, "Valid_Role_Share_Project")) {
                setErrorMessage("");
            }
            const tagData = { ProjectID, ProjectName, CustomerID: CustomerId };
            setTagName(exisitingProjectData.tagName)
            sendDataToHandler(tagData, exisitingProjectData.tagName)
        }
    }

    const fetchProjects = (searchText = '') => {
        dispatch(getProjectList(1, 100, `${LastModifiedDate}_${sortingOrder.descending}`, ProjectName, searchText))
    }

    const onSearchTextChange = (searchText) => fetchProjects(searchText)

    const getSelectedProject = () => {
        const projectId = getProjectIdFromUrl()
        if (!projectId) return null;
        return projectData;
    }

    return (
        isModalOpen && (
            <SaveTag
                isModalOpen={isModalOpen}
                projectDataList={projectRecords}
                customerNameList={customerRecords}
                saveTagData={saveTagDataHandler}
                tagName={{
                    isVisible: !selectionName,
                    value: selectionName,
                    isDisabled: !!selectionName,
                }}
                defaultSelectedProject={getSelectedProject()}
                hideComponent={hideDialogue}
                intl={intl}
                errorMsg={injectIntlTranslation(intl, errorMessage)}
                setError={setErrorMessage}
                onSearchTextChange={onSearchTextChange}
                isLoading={isLoadingData}
            />
        )
    )
}

const mapStateToProps = (state) => ({
    userCustomers: state.getUserCustomers,
    projectList: state.getProjectList,
    saveTag: state.saveTag,
    newProject: state.createNewProject
});

export default injectIntl(connect(mapStateToProps, null)(SaveTagDialogue))