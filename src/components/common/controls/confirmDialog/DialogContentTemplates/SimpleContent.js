import React from 'react'
import confirmDialogStyles from './../ConfirmDialogStyles'

const SimpleContent = (props) => {

    const { content } = props
    const { confirmContentCenterAlign, confirmContent } = confirmDialogStyles();

    return (
        <div>
            <div className={confirmContent}>
                <span>{content.primaryText}</span>
            </div>
            <div className={confirmContentCenterAlign}>
                <span><b>{content.secondaryText}</b></span>
            </div>
        </div>
    )
}

export default SimpleContent