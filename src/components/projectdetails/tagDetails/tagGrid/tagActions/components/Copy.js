import React, { memo } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from "react-intl";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import TagActionComponent from "../TagActionComponent";
import { copyTag } from '../../../../../../redux/Actions/tagActions/copyAction';
import { showLoader, injectIntlTranslation, refreshProjectList } from "@carrier/workflowui-globalfunctions";
import { getLoaderText } from "../TagActionUtil";

const Copy = (props) => {
    const { intl, tagAction: { enable, onClick }, tagData, copyTag, refreshProjectList,
        workflowDetails, dispatch, showLoader } = props;
    const title = "CopySelection";

    const onClickHandler = (event) => {
        showLoader(getLoaderText({intl, title: injectIntlTranslation(intl, title)}), false);
        if (onClick) {
            const copyMessageIds = {
                SelectionCopiedSuccessMessage: "SelectionCopiedSuccessMessage",
                CopySelectionAlreadyExists: "CopySelectionAlreadyExists",
                GenericErrorMessage: "GenericErrorMessage"
            }
            onClick({
                event,
                tagData,
                workflowDetails,
                intl,
                dispatch,
                copyMessageIds
            });
        }
        else {
            copyTag({tagData,intl});
        }
        refreshProjectList();
    }

    return (
        <TagActionComponent
            tagIcon={faCopy}
            enable={enable}
            id={title}
            title={title}
            onClick={onClickHandler}
            tagData={tagData}
        />
    )
}

Copy.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(connect(null, { copyTag, showLoader, refreshProjectList })(memo(Copy)));