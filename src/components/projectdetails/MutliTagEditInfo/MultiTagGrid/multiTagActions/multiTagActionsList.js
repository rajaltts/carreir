import React, { useContext } from 'react';
import { injectIntl } from "react-intl";
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { DynamicIcon } from "@carrier/ngecat-reactcomponents";
import multiTagActionStyles from "./multiTagActionStyles";
import { MultiTagContext } from '../../multiTagContext';
import { Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';

const MultiTagActionsList = (props) => {
   const { rowData: tagData ,intl} = props;
    const { setInvalidColumnDialog, setInvalidTagData } = useContext(MultiTagContext)
    const { warningIcon, circleIcon, green, red, toolTip } = multiTagActionStyles();
    
    const ok  = injectIntlTranslation(intl, "ButtonTextOk", "Ok")
    const no  = injectIntlTranslation(intl, "No", "NO")
    const validationStatus = tagData?.validRuleStatus?.validation ? ok : no;
    const calculationStatus = tagData?.validRuleStatus?.calculation ? ok : no;
    const saveStatus = tagData?.validRuleStatus?.save ? ok : no;
    const toolTipValidation = injectIntlTranslation(intl, "MultiTagToolTipValidation").replace('{_VALIDATESTATUS_}', validationStatus)
    const toolTipMessage = injectIntlTranslation(intl, "MultiTagToolTipCalculation").replace('{_CALCULATESTATUS_}', calculationStatus)
    const toolTipSaveMessage = injectIntlTranslation(intl, "MultiTagToolTipSave").replace('{_SAVESTATUS_}', saveStatus)
    
    const onClickWarning = (event,data) => {
        event.stopPropagation()
        setInvalidTagData([cloneDeep(data)]);
        setInvalidColumnDialog(true);
    }

    return (
        <div id="multiTagActionList">
            {
                tagData?.validRuleStatus?.error ?
                    <span  onClick={(event) => {onClickWarning(event, tagData)}}>
                        <DynamicIcon icon={faExclamationCircle} className={warningIcon} />
                    </span>
                    :
                    <Tooltip className={toolTip} title={<div>{toolTipValidation.split(":")[0]} : <span className={`${tagData?.validRuleStatus?.validation ? green : red}`}>{toolTipValidation.split(":")[1]}</span> |  <span>{toolTipMessage.split(":")[0]}</span>: <span className={`${tagData?.validRuleStatus?.calculation ? green : red}`}>{toolTipMessage.split(":")[1]}</span> | <span>{toolTipSaveMessage.split(":")[0]}</span>: <span className={`${tagData?.validRuleStatus?.save ? green : red}`}>{toolTipSaveMessage.split(":")[1]}</span></div>}>
                        <span data-heading="title" data-title={`${toolTipValidation} | ${toolTipMessage} | ${toolTipSaveMessage}`}>
                            <DynamicIcon icon={faCircle} className={classNames(circleIcon, `${tagData?.validRuleStatus?.validation ? green : red}`)} />
                            <DynamicIcon icon={faCircle} className={classNames(circleIcon, `${tagData?.validRuleStatus?.calculation ? green : red}`)} />
                            <DynamicIcon icon={faCircle} className={classNames(circleIcon, `${tagData?.validRuleStatus?.save ? green : red}`)} />
                        </span>
                    </Tooltip>
            }
        </div>
    )
}
export default injectIntl(MultiTagActionsList);