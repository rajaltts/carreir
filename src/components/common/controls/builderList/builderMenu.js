import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { translation } from '@carrier/ngecat-reactcomponents';
import BuilderList from './builderList';
import DropdownMenu from '../dropdownMenu';
import { launchSelectionFlow } from '../../../../redux/Actions/launchSelectionFlow';
import { showErrorNotification, checkForBuilderRolePermission } from "@carrier/workflowui-globalfunctions";

const BuilderMenu = (props) => {
    const { id, buttonProps, className, dropdownMenuClass, showHelpAndLibrary, filteredBy, builderList, userRole, clickHandler, history,
        projectDetails, dispatch, api, showGradient=false } = props;

    const checkForRolePermission = (workflow, childWorkflow) => {
        const hasPermission = checkForBuilderRolePermission(workflow, childWorkflow, userRole)
        !hasPermission && dispatch(showErrorNotification(translation("NO_VALID_ROLES")));
        return hasPermission;
    }

    const helpOptionHandler = (isHelpRequired, workflow, childWorkflow, closeDropdown, level) => {
        navigationToUrl(isHelpRequired, 'ProductHelp', 'Help', workflow, childWorkflow, closeDropdown, level);
    }

    const libraryOptionHandler = (isLibraryRequired, workflow, childWorkflow, closeDropdown, level) => {
        navigationToUrl(isLibraryRequired, 'ProductLibrary', 'Library', workflow, childWorkflow, closeDropdown, level);
    }

    const helpLibraryHandler = (HelpLibrary, workflow, childWorkflow, closeDropdown, level) => {
        const { name, enable = true, onClickHandler, getContentFromBuilder} = HelpLibrary;
        const rolePermission = checkForRolePermission(workflow, childWorkflow);
        closeDropdown();
        if (onClickHandler && rolePermission) {
            onClickHandler({workflow, childWorkflow, dispatch, api});
        }
        else if(enable && getContentFromBuilder && rolePermission) {
            if (name.toLowerCase() === 'help') {
                helpOptionHandler(enable, workflow, childWorkflow, closeDropdown, level)
            }
            else if (name.toLowerCase() === 'library') {
                libraryOptionHandler(enable, workflow, childWorkflow, closeDropdown, level)
            }
        }
    }

    const navigationToUrl = (navigate, urlPath, breadcrumb, workflow, childWorkflow, closeDropdown, level) => {
        if (navigate && checkForRolePermission(workflow, childWorkflow)) {
            closeDropdown();
            let productBuilderId = null;
            let modelId = null;
            if (level === 1) {
                productBuilderId = workflow.id
            } else if (level === 2) {
                productBuilderId = childWorkflow.builder
                modelId = childWorkflow.id;
            }
            const url = `/${urlPath}/${breadcrumb}?productBuilder=${productBuilderId}&modelID=${modelId}`;
            window.open(url, '_blank');
        }
    }

    const handleClick = (workflow, childWorkflow, closeDropdown) => {
        if (checkForRolePermission(workflow, childWorkflow) && !showHelpAndLibrary) {
            closeDropdown();
            if (clickHandler) {
                return clickHandler(workflow, childWorkflow, history, projectDetails);
            }
            dispatch(launchSelectionFlow({workflow, childWorkflow, history, projectDetails}));
        }
    }

    return (
        <DropdownMenu id={id} buttonProps={buttonProps} className={className} dropdownMenuClass={dropdownMenuClass} showGradient={showGradient}>
            <BuilderList
                showHelpAndLibrary={showHelpAndLibrary}
                filteredBy={filteredBy}
                handleClick={handleClick}
                builderList={builderList}
                helpOptionHandler={helpOptionHandler}
                libraryOptionHandler={libraryOptionHandler}
                helpLibraryHandler={helpLibraryHandler}
            />
        </DropdownMenu>
    )
}

const mapStateToProps = (state) => ({
    builderList: state.getAllProductsReducer.builderList,
    userRole: state.locale.role,
    api: state.api,
})

export default withRouter(connect(mapStateToProps, null)(BuilderMenu));