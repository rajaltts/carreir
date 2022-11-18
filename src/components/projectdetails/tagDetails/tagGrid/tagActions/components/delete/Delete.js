import React, { memo } from 'react';
import TagActionComponent from "../../TagActionComponent";
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import DeleteConfirmation from "./DeleteConfirmation";
import { intlShape, injectIntl } from "react-intl";
import { refreshProjectList } from "@carrier/workflowui-globalfunctions";

const Delete = (props) => {
    const { intl, tagAction: { enable, onClick, component = DeleteConfirmation },
        tagData, workflowDetails, dispatch, isProjectAdminOrOwner } = props;

    const onClickHandler = (event) => {
        const deleteMessageIds = {
            SelectionDeletionSuccessMessage: "SelectionDeletionSuccessMessage",
            GenericErrorMessage: "GenericErrorMessage"
        }
        if (onClick) {
            onClick({
                event,
                deleteMessageIds,
                tagData,
                intl,
                workflowDetails,
                dispatch
            });
            dispatch(refreshProjectList())
        }
    }

    return (
        <TagActionComponent
            tagIcon={faTrashAlt}
            enable={enable && isProjectAdminOrOwner}
            title={"DeleteSelection"}
            onClick={onClickHandler}
            tagData={tagData}
            id="DeleteSelection"
            component={component}
        />
    )
}

Delete.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl((memo(Delete)));