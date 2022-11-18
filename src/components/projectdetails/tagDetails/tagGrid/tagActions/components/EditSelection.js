import React, { memo } from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { withRouter } from 'react-router';
import { actionConstants } from "@carrier/workflowui-globalfunctions";
import TagActionComponent from "../TagActionComponent";
import { tagEdit } from '../../../../../../redux/Actions/tagActions/editTagAction';

const EditSelection = (props) => {
    const { tagAction: { enable, onClick, SelectionColumn }, tagData, history,
        workflowDetails, intl, dispatch, project } = props;
    const { ProjectName } = project;

    const onClickHandler = (event) => {
        if (onClick) {
            onClick({ event, intl, dispatch, tagData, ProjectName, workflowDetails, history });
        }
        else {
            try {
                dispatch(tagEdit(tagData, false, SelectionColumn, history));
            }
            catch (error) {
                dispatch({
                    type: actionConstants.TAG_DETAILS_FAILED,
                    data: error
                });
            }
        }
    }

    return (
        <TagActionComponent
            tagIcon={faEdit}
            enable={enable}
            id="EditSelection"
            title={"EditSelection"}
            onClick={onClickHandler}
            tagData={tagData}
        />
    )
}

export default withRouter((memo(EditSelection)));