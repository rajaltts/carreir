import React, { memo } from 'react';
import TagActionComponent from "../TagActionComponent";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router';
import { actionConstants } from "@carrier/workflowui-globalfunctions";
import { tagEdit } from '../../../../../../redux/Actions/tagActions/editTagAction';

const CopyAsAlternate = (props) => {
    const { tagAction, tagData, history,
        isFixConfiguration = false, workflowDetails, intl, dispatch } = props;
    const { enable, onClick, SelectionColumn } = tagAction;
    const tagIcon = isFixConfiguration ? faLock : faEdit;
    const title = isFixConfiguration ? "FixConfiguration" : "Editcopyasalternate"
    const id = isFixConfiguration ? "FixConfiguration" : "CopyAsAlternate"

    const onClickHandler = async (event) => {
        if (onClick) {
            onClick({ event, workflowDetails, intl, dispatch, tagData });
        }
        else {
            copyAlternateAction();
        }
    }

    const copyAlternateAction = () => {
        try {
            dispatch(tagEdit(tagData, true, SelectionColumn, history, isFixConfiguration));
        } catch (error) {
            dispatch({
                type: actionConstants.TAG_DETAILS_FAILED,
                data: error
            });
        }
    }

    return (
        <TagActionComponent
            tagIcon={tagIcon}
            enable={enable}
            title={title}
            id={id}
            onClick={onClickHandler}
            tagData={tagData}
        />
    )
}

export default withRouter((memo(CopyAsAlternate)));