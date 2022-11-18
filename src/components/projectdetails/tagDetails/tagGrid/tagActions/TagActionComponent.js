import React, { memo, useState, Suspense } from 'react';
import { DynamicIcon } from '@carrier/ngecat-reactcomponents';
import { injectIntlTranslation, tagGridColumn, checkTagLockState } from "@carrier/workflowui-globalfunctions";
import { intlShape, injectIntl } from "react-intl";
import tagActionComponentStyles from "./TagActionStyles";
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from "react-redux";

const TagActionComponent = (props) => {
    const { intl, tagIcon, id, enable = false, title = '', component, onClick, tagData = {}, checkLockStatus = false, checkTagLockState } = props;
    const [toggleComponent, setToggleComponent] = useState(false);
    const { actionLinkContainer, actionLink, disable } = tagActionComponentStyles();
    const tagClassName = (enable) ? actionLink : disable;
    const divid = tagData[tagGridColumn.SelectionName] + "_" + id;

    const hideComponentHandler = () => setToggleComponent(false);

    const onClickHandler = (event) => {
        if(enable) {
            if (checkLockStatus && tagData.TagId && tagData.TagName) {
                checkTagLockState(tagData.TagId, tagData.TagName, intl)
            }
            if (component) {
                setToggleComponent(true);
            }
            else {
                onClick && onClick(event)
            }
        }
    }

    const showComponent = () => {
        return (
            <Suspense fallback={<span></span>}>
                {React.createElement(component, {
                    dataItem: tagData, hideComponent: hideComponentHandler, hideGenerateReport: hideComponentHandler
                })}
            </Suspense>
        )
    }

    return (
        <>
            <Tooltip
                arrow={true}
                title={title && enable ? injectIntlTranslation(intl, title) : ''}
                placement="bottom"
            >
                <span
                    className={actionLinkContainer}
                    id={divid}
                    data-id={id}
                    data-enable={String(enable)}
                    onClick={onClickHandler}
                >
                    <DynamicIcon className={tagClassName} icon={tagIcon} />
                </span>
            </Tooltip>
            {toggleComponent && showComponent()}
        </>
    );
};

TagActionComponent.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(connect(null, { checkTagLockState })(memo(TagActionComponent)));