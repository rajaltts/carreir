import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants";
import { withRouter } from 'react-router';
import { getFullUrl, getTagConfiguration, actionConstants } from "@carrier/workflowui-globalfunctions";

const EditConfiguration = (props) => {
    const { tagAction, tagData, location, history, workflowDetails, intl, dispatch, project } = props;
    const { enable, onClick } = tagAction;
    const tagIcon = enable ? `${TAG_ACTIONS}edit_configuration_hover.png` : `${TAG_ACTIONS}edit_configuration.png`;
    const { ProjectName } = project;

    const onClickHandler = async (event) => {
        if (onClick) {
            onClick({ event, tagData, ProjectName, workflowDetails, intl, dispatch });
        }
        else {
            editConfigurationAction();
        }
    }

    const editConfigurationAction = () => {
        const { TagId, TagName, ProjectId } = tagData;
        const { launchUrlDetails: { configuration } } = workflowDetails;
        if (!(configuration || configuration.url)) { return };
        dispatch({
            type: actionConstants.PROJECT_DETAILS_UPDATE,
            data: project,
        });
        dispatch({
            type: actionConstants.TAG_DETAILS_UPDATE,
            data: tagData
        });
        dispatch(getTagConfiguration({ TagId }));
        const urlToNavigate = getFullUrl(location, configuration, { ProjectId, ProjectName }, { TagId, TagName });
        history.push(urlToNavigate);
    }

    return (
        <TagActionComponent
            tagIcon={tagIcon}
            enable={enable}
            title={"CloseResonOptions"}
            onClick={onClickHandler}
            id= "EditConfiguration"
            tagData={tagData}
        />
    )
}

export default withRouter(memo(EditConfiguration));