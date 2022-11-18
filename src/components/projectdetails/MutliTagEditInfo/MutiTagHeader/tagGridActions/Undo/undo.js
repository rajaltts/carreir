import React from 'react';
import { injectIntl } from "react-intl";
import UndoIcon from '@material-ui/icons/Undo';
import UndoStyles from './UndoStyles';
const Undo = () => {
    const { undoIcon } = UndoStyles();
    const UndoTag = () => {
        
    }
    return (
        <UndoIcon className={undoIcon} onClick={UndoTag} />
    )
}

export default injectIntl(Undo);