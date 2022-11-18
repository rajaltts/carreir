import React from 'react';
import classNames from 'classnames';
import { translation } from '@carrier/ngecat-reactcomponents';
import { checkForBuilderPermission } from '@carrier/workflowui-globalfunctions';
import useBuilderListStyles from './builderListStyle';
import {connect} from 'react-redux'
import { showInfoNotification} from "@carrier/workflowui-globalfunctions"; 

const BuilderList = (props) => {

    const { showHelpAndLibrary = false, filteredBy, builderList = [], closeDropdown, handleClick, helpOptionHandler,
        libraryOptionHandler, helpLibraryHandler } = props;
    const { root, activeItem, spacingLevel1, spacingLevel2, spacingLevel3, spacingLevelHelpAndLibrary, disabled } = useBuilderListStyles();

    const getWorkflowList = () => {
        if (!builderList.length) { return translation("NOBUILDERSFOUND") };

        const list = [];
        builderList.forEach((workflow) => {
            const { helpOrLibrarySupported, childrenWorkflow, hideChildrenWorkflow } = workflow;
            if (showHelpAndLibrary && !helpOrLibrarySupported) { return };

            const workflowItem = getWorkflowItem(spacingLevel1, workflow);
            workflowItem && list.push(workflowItem);
            showHelpAndLibrary && list.push(getHelpAndLibraryItem(spacingLevel2, workflow, {}, 1));
            if (!hideChildrenWorkflow && childrenWorkflow && !!childrenWorkflow.length) {
                const childList =[];
                childrenWorkflow.forEach((childWorkflow) => {
                    const className = showHelpAndLibrary ? spacingLevelHelpAndLibrary : spacingLevel2;
                    const item = getWorkflowItem(className, workflow, childWorkflow);
                    if (item) {
                        if (showHelpAndLibrary) {
                            if (childWorkflow.helpOrLibrarySupported) {
                                childList.push(item);
                                childList.push(getHelpAndLibraryItem(spacingLevel3, workflow, childWorkflow, 2));
                            }
                        } else {
                            childList.push(item);
                        }
                    }
                })
                !!childList.length && list.push(<div key={`parent_workflow_${workflow.id}`}>{childList}</div>);
            }
        })

        if (!list.length) { return translation("NOBUILDERSFOUND") };

        return list;
    }

    const getWorkflowItem = (className, workflow, childWorkflow = {}) => {
        let showItem = checkForBuilderPermission(workflow, childWorkflow);
        if (filteredBy && showItem) {
            if (childWorkflow.id) {
                showItem = childWorkflow[filteredBy] && childWorkflow[filteredBy].visible && workflow[filteredBy] && workflow[filteredBy].visible;
            } else if (!workflow.hideChildrenWorkflow && workflow.childrenWorkflow && !!workflow.childrenWorkflow.length) {
                showItem = workflow.childrenWorkflow.find(item => item[filteredBy] && item[filteredBy].visible)
            } else {
                showItem = workflow[filteredBy] && workflow[filteredBy].visible;
            }
        }
        const launchUrl = !showHelpAndLibrary && (childWorkflow.launchUrl || workflow.launchUrl);
        const displayName = childWorkflow.displayName || workflow.displayName;
        const id = childWorkflow.id || workflow.id;
        const visible = childWorkflow.id ? childWorkflow.visible && workflow.visible : workflow.visible;
        const childDataIdAttr = childWorkflow.displayName ? `_${childWorkflow.displayName}` : "";
        const dataIdAttr = `${workflow.displayName}${childDataIdAttr}`;
        
        return (showItem && visible &&
            <div
                key={id}
                data-id={dataIdAttr}
                id={id}
                className={classNames(className, launchUrl && activeItem)}
                onClick={event => handleClick && handleClick(workflow, childWorkflow, closeDropdown)}
            >
                {displayName}
            </div>
        );
    }

    const getHelpAndLibraryItem = (className, workflow, childWorkflow, level) => {
        const isHelpRequired = getHelpAndLibraryValue(workflow, childWorkflow, "isHelpRequired", level);
        const id = childWorkflow.id || workflow.id;
        const isLibraryRequired = getHelpAndLibraryValue(workflow, childWorkflow, "isLibraryRequired", level);
        const helpLibraryList = getHelpAndLibraryValue(workflow, childWorkflow, "HelpLibrary", level);
        return (
            <>
                {!checkForNullOrUndefined(isHelpRequired) &&
                    <div
                        id={`${id}_help`}
                        className={classNames(className, isHelpRequired ? activeItem : disabled)}
                        data-disabled={!isHelpRequired}
                        onClick={event => helpOptionHandler && helpOptionHandler(isHelpRequired, workflow, childWorkflow, closeDropdown, level)}
                    >
                        {translation("Help")}
                    </div>
                }
                {!checkForNullOrUndefined(isLibraryRequired) &&
                    <div
                        id={`${id}_library`}
                        className={classNames(className, isLibraryRequired ? activeItem : disabled)}
                        data-disabled={!isLibraryRequired}
                        onClick={event => libraryOptionHandler && libraryOptionHandler(isLibraryRequired, workflow, childWorkflow, closeDropdown, level)}
                    >
                        {translation("Library")}
                    </div>
                }
                {!checkForNullOrUndefined(helpLibraryList) && 
                    helpLibraryList.map((hl) => {
                    const { visible, name, enable = true } = hl;
                    return visible &&
                        <div
                            id={`${id}_${name}`}
                            className={classNames(className, enable ? activeItem : disabled)}
                            data-disabled={!enable}
                            onClick={ () => helpLibraryHandler && helpLibraryHandler(hl, workflow, childWorkflow, closeDropdown, level)}
                        >
                            {translation(name.charAt(0).toUpperCase() + name.slice(1))}
                        </div>}
                    )
                }
            </>
        )
    }

    const checkForNullOrUndefined = (value) => {
        return value === null || value === undefined;
    }

    const getHelpAndLibraryValue = (workflow, childWorkflow, value, level) => {
        if (level === 1) {
            return workflow[value]
        } else if (level === 2) {
            return childWorkflow[value];
        }
    }

    return (
        <div className={root}>
            { getWorkflowList() }
        </div>
    )
}
const mapStateToProps = (state) => ({
    eCatAppService: state.api.eCatAppService,
})
export default connect(mapStateToProps,{ showInfoNotification })(BuilderList)
