import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants"

const TagStatus = ({ tagData, tagAction: { enable, statusType = 0 } }) => {
    const getIconListForStatus = (status) => {
        let iconName;
        if (status === 0 || status === 3 || status === 4 || status === 5) {
            iconName = `${TAG_ACTIONS}Attention.png`;
        }
        else if (status === 1) {
            iconName = `${TAG_ACTIONS}valid.png`
        }
        else if (status === 2 || status === 6) {
            iconName = `${TAG_ACTIONS}Invalid.png`
        }
        return iconName
    }

    return (
        <TagActionComponent
            id="TagStatus"
            tagIcon={getIconListForStatus(statusType)}
            enable={enable}
            tagData={tagData}
        />
    )
}

export default memo(TagStatus);