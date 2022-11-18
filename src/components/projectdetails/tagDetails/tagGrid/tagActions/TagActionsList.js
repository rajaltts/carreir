import React, { memo } from 'react';
import DrawingManager from "./components/DrawingManager";
import TagStatus from "./components/TagStatus";
import Copy from "./components/Copy";
import CopyAsAlternate from "./components/CopyAsAlternate";
import CopyProject from "./components/copyProject/CopyProject";
import EditConfiguration from "./components/EditConfiguration";
import Reports from "./components/Reports";
import EditSelection from "./components/EditSelection";
import TagUpgrade from "./components/TagUpgrade";
import Delete from "./components/delete/Delete";
import { tagActionsType } from "@carrier/workflowui-globalfunctions";
import { getChildWorkFlowDetails } from "./TagActionUtil";
import { connect } from 'react-redux';
import { injectIntl } from "react-intl";
import tagActionComponentStyles from "./TagActionStyles";
import AlternateRefrigerant from "./components/AlternateRefrigerant";
import { isProjectAdminOrOwner, isProjectViewer } from "@carrier/workflowui-globalfunctions";

const TagActionsList = (props) => {
    const { value: TagActions, rowData: tagData, builderList, dispatch, intl, project } = props;
    const { IsEditSelection, IsDeleteTag,IsEditCopyasAlternate, IsFixConfiguration,
        IsCopyTag, IsCopyTagToProject,IsAlternateRefrigerant, IsReports, IsEditConfiguration, IsDrawingManager,
        Status, IsUpgrade } = tagActionsType;
    const { actionsContainer } = tagActionComponentStyles();

    const createTagActions = (tagAction) => {
        const { action } = tagAction;
        const { TagModel, ProductBuilder: Builder } = tagData;
        const workflowDetails = getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderList);
        const actionProps = {
            tagAction,
            tagData,
            dispatch,
            intl,
            workflowDetails,
            project,
            isProjectAdminOrOwner: isProjectAdminOrOwner(project.UserRole), 
            isProjectViewer: isProjectViewer(project.UserRole),
        }
        switch (action) {
            case IsEditSelection:
                return <EditSelection {...actionProps} />
            case IsEditCopyasAlternate:
                return <CopyAsAlternate {...actionProps} />;
            case IsFixConfiguration:
                return <CopyAsAlternate {...actionProps} isFixConfiguration />;
            case IsCopyTag:
                return <Copy {...actionProps} />
            case IsCopyTagToProject:
                return <CopyProject {...actionProps} />
            case IsDeleteTag:
                return <Delete {...actionProps} />;
            case IsReports:
                return <Reports {...actionProps} />
            case IsEditConfiguration:
                return <EditConfiguration {...actionProps} />;
            case IsDrawingManager:
                return <DrawingManager {...actionProps} />
            case Status:
                return <TagStatus {...actionProps} />
            case IsUpgrade:
                return <TagUpgrade {...actionProps} />
            case IsAlternateRefrigerant:
                    return <AlternateRefrigerant {...actionProps} />;
            default: return null;
        }
    }
    const handleOnClick = (event) =>{
        event.stopPropagation();
    }

    return (
        <div className={actionsContainer} onClick={handleOnClick}>
            {TagActions.map(tagAction => createTagActions(tagAction))}
        </div>
    )
}

const mapStateToProps = (state) => ({
    builderList: state.getAllProductsReducer.builderList,
    project: state.createNewProject.projectData,
});

export default injectIntl(connect(mapStateToProps)(memo(TagActionsList)));