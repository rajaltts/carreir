import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from "react-intl";
import { CustomGrid, TabsContainer } from '@carrier/ngecat-reactcomponents';
import {
    injectIntlTranslation, projectListColumn, getProjectList, validateFormFields,
    defaultValidation, defaultValidationMessages, showErrorNotification, refreshTagDetails, isProjectOwner,
    updateProjectData, getFullUrl, breadcrumbText, getUserCustomers, projectType as ProjectType, showWarningNotification
} from '@carrier/workflowui-globalfunctions';
import { projectGridConfig } from "./projectGridConfig";
import projectGridStyles from './projectGridStyles';
import { projectNameEditAction } from '../../../redux/Actions/projectListActions/updateProjectNameAction';
import { updateProjectType } from '../../../redux/Actions/projectListActions/projectType';
import { updateProjectGridState } from '../../../redux/Actions/updateProjectListState';
import { getSharePermission } from  './projectShare/ProjectShareUtils';

const ProjectGrid = (props) => {
    const { getProjectList, intl, lang, projectNameEditAction, updateProjectGridState,
        projectInfo, showErrorNotification, refreshTagDetails, permissions, history, location,
        updateProjectType, showWarningNotification, updateProjectData } = props;
    const { records: projectList, isLoading, needRefresh, totalCount, NewlySharedProjectsCount, order,
        orderBy, rowsPerPage, page, searchColumn, searchText, error, projectType } = projectInfo;
    const { gridRoot, actionsStyles, rowClassName, tdClassName, divisionLine, pagination, lastModifiedDate,
        projectNameStyles } = projectGridStyles();
    const { ProjectName, ProjectCustomer, OwnerName, UserRole, SharedWith, LastModifiedDate, Actions } = projectListColumn;

    const getHeaderData = () => {
        const hasSharePermission = true; //getSharePermission(permissions);
        const headerData = [
            { name: ProjectName, displayName: injectIntlTranslation(intl, ProjectName), className: tdClassName, sortingClassName: tdClassName },
            { name: ProjectCustomer, displayName: injectIntlTranslation(intl, "Customer"), disableSorting: true, className: tdClassName, sortingClassName: tdClassName },
            { name: OwnerName, displayName: injectIntlTranslation(intl, "Owner"), disableSorting: true, className: tdClassName, sortingClassName: tdClassName },
        ]
        if (hasSharePermission) {
            (projectType !== ProjectType.AllProjects) && headerData.push(
                { name: UserRole, displayName: injectIntlTranslation(intl, "MyRole"), disableSorting: true, className: tdClassName, sortingClassName: tdClassName },
            )
            headerData.push(
                { name: SharedWith, displayName: injectIntlTranslation(intl, SharedWith), disableSorting: true, className: tdClassName, sortingClassName: tdClassName }
            )
        } 
        headerData.push(
            { name: LastModifiedDate, displayName: injectIntlTranslation(intl, "LastUpdate"), className: tdClassName, sortingClassName: tdClassName },
            { name: Actions, displayName: ' ', disableSorting: true, className: actionsStyles, sortingClassName: tdClassName }
        )
        return headerData;
    }

    const getTabs = () => {
        return [
            {name: injectIntlTranslation(intl, "MyProjects")},
            {name: injectIntlTranslation(intl, "SharedWithMe"), badgeContent: NewlySharedProjectsCount}
        ];
    };

    const [loadGrid, setLoadGrid] = useState(false);
    const [headCells, setHeadCells] = useState(getHeaderData());
    const [tabs, setTabs] = useState(getTabs());
    const [oldGridState, setOldGridState] = useState({});

    const updateOwner = (value, projectData) => {
        const fullName = value && JSON.parse(value);
        const firstName = (fullName && fullName.FirstName) || ''
        if (isProjectOwner(projectData[projectListColumn.UserRole])) {
            return `${firstName} (${injectIntlTranslation(intl, "Me")})`;
        }
        return firstName;
    }

    useEffect(() => {
        !projectList.length && !isLoading && fetchProjectList();
        setLoadGrid(true);
        refreshTagDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        needRefresh && fetchProjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needRefresh]);

    useEffect(() => {
        setHeadCells(getHeaderData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, projectType]);

    useEffect(() => {
        setTabs(getTabs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, NewlySharedProjectsCount]);

    useEffect(() => {
        if (error) {
            updateProjectGridState(oldGridState);
            showErrorNotification(injectIntlTranslation(intl, "GenericErrorMessage"))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const fetchProjectList = () => getProjectList((page + 1), rowsPerPage, `${orderBy}_${order}`, searchColumn, searchText, projectType)

    const updateProjectNameHandler = (event, editedValue, rowData, rowIndex) => {
        if (isProjectOwner(rowData[projectListColumn.UserRole])) {
            projectNameEditAction({ projectData: rowData, editedValue, intl })
        } else {
            showWarningNotification(injectIntlTranslation(intl, "Valid_Role_Share_Project"));
        }
    }

    const validateProjectName = (editedValue) => validateFormFields(editedValue, defaultValidation, defaultValidationMessages(intl));

    const gridStateHandler = (newGridState) => {
        const { orderBy: newOrderBy, rowsPerPage: newRowsPerPage, page: newPage, order: newOrder } = newGridState;
        if ((orderBy !== newOrderBy) || (rowsPerPage !== newRowsPerPage) ||
            (page !== newPage) || (order !== newOrder)) {
            setOldGridState({
                orderBy,
                rowsPerPage,
                page,
                order
            })
            updateProjectGridState(newGridState);
            getProjectList(
                (newPage + 1),
                newRowsPerPage,
                `${newOrderBy}_${newOrder}`,
                searchColumn,
                searchText,
                projectType
            )
        }
    }

    const rowOnclickHandler = (projectData) => {
        const { ProjectID, ProjectName, CustomerId, UserRole } = projectData
        updateProjectData({ ProjectID: ProjectID, ProjectName: ProjectName, CustomerID: CustomerId, UserRole: UserRole });
        const url = getFullUrl(
            location,
            { url: `/${breadcrumbText.projectDetail}` },
            { ProjectId: ProjectID, ProjectName: ProjectName }
        );
        history.push(url, { ...projectData });
    }

    const tabChangeHandler = (activeTab) => {
        updateProjectType(activeTab)
    }

    projectGridConfig[OwnerName].formatValue = updateOwner
    projectGridConfig[ProjectName].onDoubleClick = updateProjectNameHandler;
    projectGridConfig[ProjectName].validations = { validation: validateProjectName }
    projectGridConfig[ProjectName].className = projectNameStyles
    projectGridConfig[ProjectCustomer].className = projectNameStyles
    projectGridConfig[LastModifiedDate].className = lastModifiedDate

    return (
        <div id="projectGrid">
            <TabsContainer
                divisonLineClassname={divisionLine}
                onTabChange={tabChangeHandler}
                defaultActiveTab={projectType}
                tabs={tabs}
            />
            {loadGrid &&
                <CustomGrid
                    gridClassName={gridRoot}
                    rowClassName={rowClassName}
                    showCheckbox={false}
                    headCells={headCells}
                    rows={projectList}
                    isLoading={isLoading}
                    hideSearch
                    sortable
                    rowsToShowPerPage={rowsPerPage}
                    doNotTranslate={false}
                    config={projectGridConfig}
                    rowsPerPageOptions={[5, 10, 20, 100]}
                    sorting={order}
                    gridStateHandler={gridStateHandler}
                    orderByfield={orderBy}
                    pageNumber={page}
                    stateLessGrid
                    totalPageCount={totalCount}
                    showLinearProgress={isLoading && !!projectList.length}
                    paginationClass={pagination}
                    rowOnclickHandler={rowOnclickHandler}
                    showDivider
                />
            }
        </div>
    );
};

const mapStateToProps = (state) => ({
    lang: state.locale.leafLocale,
    projectInfo: state.getProjectList,
    permissions: state.userProfile.permissions,
    userCustomers: state.getUserCustomers.records,
});

export default injectIntl(withRouter(connect(mapStateToProps, {
    getProjectList, refreshTagDetails, projectNameEditAction, updateProjectGridState,
    showErrorNotification, updateProjectData, getUserCustomers, updateProjectType, showWarningNotification
})(ProjectGrid)));