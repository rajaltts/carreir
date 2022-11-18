import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants"

const Reports = (props) => {
    const { tagAction, tagData, dispatch, intl, workflowDetails } = props;
    const { enable, onClick, component } = tagAction;

    const tagIcon = enable ? `${TAG_ACTIONS}generate_selection-report_hover.png` : `${TAG_ACTIONS}generate_selection-report.png`;

    const onClickHandler = (event) => {
        onClick && onClick({event, dispatch, workflowDetails, intl, tagData});
    }

    return (
        <>
            <TagActionComponent
                tagIcon={tagIcon}
                enable={enable}
                title={"GenerateSelectionReport"}
                id="GenerateSelectionReport"
                onClick={onClickHandler}
                tagData={tagData}
                component={component}
                checkLockStatus
            />
        </>
    )
}

export default memo(Reports);