import React from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
const PasteAll = () => {
    const { tagColItems, defaultIcon, openText } = multiTagHeaderStyles();
    const PasteAllTag = () => {
        
    }
    return (
        <div className={tagColItems}>
            <FontAwesomeIcon icon={faClipboard} className={defaultIcon} onClick={PasteAllTag} />
            <span className={openText}>{translation("MultiTagPasteAll")}</span>
        </div>
    )
}

export default injectIntl(PasteAll);