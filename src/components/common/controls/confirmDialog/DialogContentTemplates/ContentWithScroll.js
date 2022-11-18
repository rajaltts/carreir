import React, { useState } from 'react'
import confirmDialogStyles from './../ConfirmDialogStyles'
import Typography from '@material-ui/core/Typography';

const ContentWithScroll = (props) => {

    const { content } = props
    const { confirmContentLeftAlign, expandMoreLink, expandedDiv, confirmContent, leftPadding, listPadding } = confirmDialogStyles();
    const tagsList = content.secondaryText.split(",")
    const remainingList = tagsList.length - 10
    const [expanded, setexpanded] = useState(false)

    const expandedText = () => {
        setexpanded(true);
    }

    const renderIntialContent = () => {
        const limited = tagsList.filter((val, i) => i < 10)
        return (
            !expanded &&
            <div className={leftPadding}>
                {createList(limited)}
            </div>
        )
    }

    const renderExpandLink = () => {
        return (
            (!expanded && remainingList > 0) &&
            <div>
                <Typography className={expandMoreLink} onClick={expandedText}>+ {remainingList} more elements</Typography>
            </div>
        )
    }

    const createList = (tagsList) => {
        return (
            <ul className={listPadding}>
                {
                    tagsList.map((tagName) =>
                        <li><b>{tagName}</b></li>
                    )
                }
            </ul>
        )
    }

    const renderExpandedContent = () => {
        return (
            expanded &&
            <div className={[expandedDiv]}>
                {createList(tagsList)}
            </div>
        )
    }

    return (
        <div>
            <div className={confirmContent}>
                <span>{content.primaryText}</span>
            </div>
            <div className={confirmContentLeftAlign}>
                {renderIntialContent()}
                {renderExpandLink()}
                {renderExpandedContent()}
            </div>
        </div>
    );
}

export default ContentWithScroll