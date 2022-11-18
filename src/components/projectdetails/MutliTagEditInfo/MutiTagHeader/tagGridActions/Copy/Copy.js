import React, { useContext, useEffect } from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext'

const Copy = () => {
    const { tagColItems, copyIcon, openText } = multiTagHeaderStyles();
    const { copyAction = () => { }, gridActions } = useContext(MultiTagContext)

    const CopyTag = () => {
        if (gridActions.copyTag && copyAction) {
            copyAction()
        }
    }

    const keyCodeHandler = (event) => {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13 && gridActions.copyTag && copyAction) {
            copyAction()
        }
    }

    return (
        <div className={tagColItems} onKeyDown={keyCodeHandler} onClick={CopyTag} tabIndex={2}>
            <FontAwesomeIcon icon={faClone} className={copyIcon} />
            <span className={openText}>{translation("MultiTagCopy")}</span>
        </div>
    )
}

export default injectIntl(Copy);