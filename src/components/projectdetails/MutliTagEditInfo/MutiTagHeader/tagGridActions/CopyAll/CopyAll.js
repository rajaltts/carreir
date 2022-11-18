import React from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
const CopyAll = () => {
    const { tagColItems, copyIcon, openText } = multiTagHeaderStyles();
    const CopyAllTag = () => {
        
    }
    return (
        <div className={tagColItems}>
            <FontAwesomeIcon icon={faClone} className={copyIcon} onClick={CopyAllTag} />
            <span className={openText}>{translation("MultiTagCopyAll")}</span>
        </div>
    )
}

export default injectIntl(CopyAll);