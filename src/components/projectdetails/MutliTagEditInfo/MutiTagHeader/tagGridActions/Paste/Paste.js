import React, { useContext, useEffect } from 'react';
import { injectIntl } from "react-intl";
import { translation } from "@carrier/ngecat-reactcomponents";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import multiTagHeaderStyles from '../../multiTagHeaderStyles';
import { MultiTagContext } from '../../../multiTagContext'

const Paste = () => {
    const { tagColItems, defaultIcon, openText } = multiTagHeaderStyles();
    const { pasteAction = () => {}, gridActions } = useContext(MultiTagContext)

    const PasteTag = () => {
        if (gridActions.pasteTag && pasteAction) {
            pasteAction()
        }
    }

    const keyCodeHandler = (event) => {
        if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.keyCode === 13 && gridActions.pasteTag && pasteAction) {
            pasteAction()
        }
    }

    return (
        <div className={tagColItems} onKeyDown={keyCodeHandler} onClick={PasteTag} tabIndex={2}>
            <FontAwesomeIcon icon={faClipboard} className={defaultIcon} />
            <span className={openText}>{translation("MultiTagPaste")}</span>
        </div>
    )
}

export default injectIntl(Paste);