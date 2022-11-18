import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { TAG_ACTIONS } from "../../../../../../utilities/constants/Constants"

const AlternateRefrigerant = (props) => {
    const { tagAction, tagData, dispatch, intl, workflowDetails } = props;
    const { enable, onClick, component } = tagAction;

    const tagIcon = enable ? `${TAG_ACTIONS}compare_alternate_refrigerant_hover.svg` : `${TAG_ACTIONS}compare_alternate_refrigerant.svg`;

    const onClickHandler = (event) => {
        onClick && onClick({event, dispatch, workflowDetails, intl, tagData});
    }

    return (
            <TagActionComponent
                tagIcon={tagIcon}
                enable={enable}
                title={"CompareAlternateRefrigerant"}
                id="CompareAlternateRefrigerant"
                onClick={onClickHandler}
                tagData={tagData}
                component={component}
            />
    )
}

export default memo(AlternateRefrigerant);