import React, { memo, useState } from 'react';
import { injectIntlTranslation } from "@carrier/workflowui-globalfunctions";
import { intlShape, injectIntl } from "react-intl";
import tagActionComponentStyles from "../../../projectdetails/tagDetails/tagGrid/tagActions/TagActionStyles";
import MenuItem from '@material-ui/core/MenuItem';

const ProjectActionComponent = (props) => {
    const { intl, id, name = '', component, onClick, closeDropdown = null, projectData = {}, disabled } = props;
    const { ProjectName } = projectData
    const [toggleComponent, setToggleComponent] = useState(false);
    const { menuItem } = tagActionComponentStyles();
    const divid = ProjectName + "_" + id;

    const hideComponentHandler = (close, event) => {
        closeDropdown && closeDropdown(event);
        setToggleComponent(false);
    }

    const onClickHandler = (event) => {
        if (component) {
            setToggleComponent(true);
        }
        else {
            closeDropdown && closeDropdown(event);
            onClick && onClick(event)
        }
    }

    const showComponent = () => {
        return React.createElement(component, {
            dataItem: projectData, hideComponent: hideComponentHandler, closeDropdown
        });
    }

    return (
        <>
            <MenuItem id={divid} data-id={id} className={menuItem} onClick={onClickHandler} dense disabled={disabled}>
                {injectIntlTranslation(intl, name)}
            </MenuItem>
            {toggleComponent && showComponent()}
        </>
    );
};

ProjectActionComponent.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(memo(ProjectActionComponent));