import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import appConfig from '../../../../../../Environment/environments';
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants";

const DrawingManager = (props) => {
    const { tagAction: { enable, onClick }, tagData, workflowDetails, intl, dispatch,
        isProjectViewer } = props;
    const tagIcon = enable ? `${TAG_ACTIONS}DM_active.png` : `${TAG_ACTIONS}DM_Inactive.png`;

    const onClickHandler = (event) => {
        if (onClick) {
            onClick({event, tagData, workflowDetails, intl, dispatch});
        }
        else {
            window.open(`${appConfig.api.drawingManagerUrl}/home?tagid=${tagData.TagId}`, '_blank')
        }
    }

    return (
        <TagActionComponent
            enable={enable && !isProjectViewer}
            tagIcon={tagIcon}
            id="DrawingManager"
            title={"DrawingManager"}
            onClick={onClickHandler}
            tagData={tagData}
        />
    )
}

export default memo(DrawingManager);