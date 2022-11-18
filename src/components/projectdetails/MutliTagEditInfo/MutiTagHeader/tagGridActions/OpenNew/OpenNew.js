import React, { useContext } from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext';
const OpenNew = () => {
    const { tagColItems, defaultIcon, openText } = multiTagHeaderStyles();
    const { openAction = () => {}, unlockTags } = useContext(MultiTagContext)
    
    const openNewTag = async () => {
        if (openAction) {
            await unlockTags()
            openAction() 
        }
    }
    
    const keyCodeHandler = (event) => {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13 && openAction) {
            openNewTag()
        }
    }

    return (
        <div className={tagColItems} onClick={openNewTag} onKeyDown={keyCodeHandler} tabIndex={2}>
            <OpenInNewIcon className={defaultIcon}  />
            <span className={openText}>{translation("MultiTagOpen")}</span>
        </div>
    )
}

export default injectIntl(OpenNew);