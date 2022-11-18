import React, { memo } from 'react';
import TagActionComponent from "../../TagActionComponent";
import { faClone } from '@fortawesome/free-regular-svg-icons';
import CopyProjectDialog from "./CopyProjectDialog";
import { intlShape, injectIntl } from "react-intl";
import { refreshProjectList } from "@carrier/workflowui-globalfunctions";

const CopyProject = (props) => {
    const { tagAction, tagData, workflowDetails, intl, dispatch } = props;
    const { enable, onClick, component = CopyProjectDialog } = tagAction;

    const onClickHandler = (event) => {
        const copyMessageIds = {
            SelectionCopiedSuccessMessage: "SelectionCopiedSuccessMessage",
            CopySelectionAlreadyExists: "CopySelectionAlreadyExists",
            GenericErrorMessage: "GenericErrorMessage"
        }
        if (onClick) {
            onClick({
                event,
                copyMessageIds,
                tagData,
                workflowDetails,
                intl,
                dispatch
            });
            dispatch(refreshProjectList())
        }
    }

    return (
        <TagActionComponent
            tagIcon={faClone}
            enable={enable}
            title={"CopySelectiontoproject"}
            id="CopySelectiontoproject"
            onClick={onClickHandler}
            tagData={tagData}
            component={component}
        />
    )
}

CopyProject.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl((memo(CopyProject)));