import React, { useContext } from 'react';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import { isProjectAdminOrOwner } from '@carrier/workflowui-globalfunctions';
import DeleteIcon from '@material-ui/icons/Delete';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext'

const Delete = (props) => {
    const { userProjectRole } = props;
    const { tagColItems, defaultIcon, openText } = multiTagHeaderStyles();
    const { deleteAction = () => {} } = useContext(MultiTagContext)
    
    const DeleteTag = () => {
        deleteAction && deleteAction()
    }

    const keyCodeHandler = (event) => {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13 && deleteAction) {
            deleteAction()
        }
    }

    return (
        <>
            {
                isProjectAdminOrOwner(userProjectRole) &&
                    <div className={tagColItems} onClick={DeleteTag} onKeyDown={keyCodeHandler} tabIndex={2}>
                        <DeleteIcon className={defaultIcon}/>
                        <span className={openText}>{translation("MultiTagDelete")}</span>
                    </div>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
userProjectRole: state.createNewProject.projectData.UserRole,
});

export default injectIntl(connect(mapStateToProps,{})(Delete));