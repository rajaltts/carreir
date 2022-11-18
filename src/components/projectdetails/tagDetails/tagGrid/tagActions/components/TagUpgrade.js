import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants";
import { connect } from 'react-redux';
import UpgradeDialog from "../../../tagGridActions/batchUpgrade/UpgradeDialog";
import { refreshProjectList } from "@carrier/workflowui-globalfunctions";

const TagUpgrade = (props) => {
    const { intl, tagAction, tagData, workflowDetails, dispatch } = props;
    const { enable, onClick, component=UpgradeDialog } = tagAction;
    const tagIcon = enable ? `${TAG_ACTIONS}Upgrade_enable.png` : `${TAG_ACTIONS}Upgrade.PNG`;

    const onClickHandler = (event) => {
        if (onClick) {
            const upgradeMessageIds = {
                TagUpgradeInProgress: "TagUpgradeInProgress",
                SelectionUpgradeFailureMessage: "SelectionUpgradeFailureMessage",
                BulkUpgradeFailureMessage: "BulkUpgradeFailureMessage",
                SelectionUpgradeSuccessMessage: "SelectionUpgradeSuccessMessage",
            }
            onClick({
                event,
                tagData,
                upgradeMessageIds,
                intl,
                dispatch,
                workflowDetails
            });
            dispatch(refreshProjectList())
        }
    }

    return (
        <TagActionComponent
            tagIcon={tagIcon}
            enable={enable}
            title={"TagUpgrade"}
            onClick={onClickHandler}
            id="TagUpgrade"
            tagData={tagData}
            component={component}
        />
    )
}

export default connect(null, null)(memo(TagUpgrade));