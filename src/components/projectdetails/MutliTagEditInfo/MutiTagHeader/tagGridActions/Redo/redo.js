import React from 'react';
import { injectIntl } from "react-intl";
import RedoIcon from '@material-ui/icons/Redo';
import RedoStyles from './RedoStyles';
const Redo = () => {
    const { redoIcon } = RedoStyles();
    const RedoTag = () => {
        
    }
    return (
        <RedoIcon className={redoIcon} onClick={RedoTag} />
    )
}

export default injectIntl(Redo);