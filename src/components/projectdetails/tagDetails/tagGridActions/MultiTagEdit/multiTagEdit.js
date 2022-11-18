import React from 'react';
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { injectIntlTranslation, getFullUrl, breadcrumbText, tagDataKeys, isProjectViewer } from '@carrier/workflowui-globalfunctions';
import CustomButton from '../../../../common/controls/CustomButton';
import tagGridActionsStyles from '../tagGridActionsStyles';

const MultiTagEdit = (props) => {
    const { inlineDisplay} = tagGridActionsStyles()
    const { intl, projectData, tags, tagGridAction, userProjectRole, location, history } = props;
    
    const showMultiTagEditInfo = () => {
        const { ProjectID, ProjectName } = projectData
        const url = getFullUrl(
            location,
            { url: `/${breadcrumbText.projectDetail}` },
            {[breadcrumbText.projectId]: ProjectID, [breadcrumbText.projectName]: ProjectName, [breadcrumbText.isMultiTag]: true}
            );
            history.push(url, { ...projectData, [breadcrumbText.isMultiTag]: true});
    }

    if (!tagGridAction[tagDataKeys.IsMultiTagEdit]) {
        return null;
    }

    const multiTagEditText = injectIntlTranslation(intl, "MultiTagEdit");
    return (
        <div className={inlineDisplay}>
            {(!!tags.length) &&
                <CustomButton
                    id='multiTagEditId'
                    name={multiTagEditText}
                    disabled={isProjectViewer(userProjectRole)}
                    onClick={showMultiTagEditInfo}
                    iconProps={{ icon: faPen, alt: multiTagEditText }}
                />
            }
        </div>
    )
}

const mapStateToProps = state => ({
    tags: state.tagList.tags,
    tagGridAction: state.tagList.tagGridActions,
    userProjectRole: state.createNewProject.projectData.UserRole
});

export default injectIntl(withRouter(connect(mapStateToProps)(MultiTagEdit)));
