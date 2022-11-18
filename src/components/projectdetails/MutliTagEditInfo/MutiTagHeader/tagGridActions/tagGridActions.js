import React from "react";
import OpenNew from './OpenNew/OpenNew';
import Duplicate from './Duplicate/Duplicate';
import Delete from './Delete/Delete';
import Copy from "./Copy/Copy";
import Paste from "./Paste/Paste";
import multiTagHeaderStyles from '../multiTagHeaderStyles';
const TagGridActions = ({gridActions}) => {
    const { tagCol, actionsGrid, verticalLineIcon } = multiTagHeaderStyles();
    const { openTag, duplicateTag, deleteTag, copyTag, pasteTag} = gridActions;
    
    return (
        <div className={actionsGrid}>
            <div className={tagCol}>
                {(openTag || duplicateTag || deleteTag) && <span class={verticalLineIcon} ></span>}
                {openTag && <OpenNew />}
                {duplicateTag && <Duplicate />}
                {deleteTag && <Delete />}
                {(copyTag || pasteTag) && <span class={verticalLineIcon} ></span>}
                {copyTag && <Copy />}
                {pasteTag && <Paste />}
            </div>
        </div>
    )
}

export default TagGridActions;