import React, { useContext } from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import DuplicateIcon from '@material-ui/icons/FileCopy';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext'

const DuplicateAction = () => {
    const { tagColItems, defaultIcon, openText } = multiTagHeaderStyles();
    const { duplicateAction = () => {} } = useContext(MultiTagContext)
    
    const duplicateTag = () => {
        duplicateAction && duplicateAction()
    }

    const keyCodeHandler = (event) => {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13 && duplicateAction) {
            duplicateAction()
        }
    }
    
    return (
        <div className={tagColItems} onKeyDown={keyCodeHandler} onClick={duplicateTag} tabIndex={2}>
            <DuplicateIcon className={defaultIcon}  />
            <span className={openText}>{translation("MultiTagDuplicate")}</span>
        </div>
    )
}

export default injectIntl(DuplicateAction);