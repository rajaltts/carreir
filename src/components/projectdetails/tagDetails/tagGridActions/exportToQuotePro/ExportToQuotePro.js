import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { translation } from '@carrier/ngecat-reactcomponents';
import { tagDataKeys } from '@carrier/workflowui-globalfunctions';
import CustomButton from '../../../../common/controls/CustomButton';
import appConfig from '../../../../../Environment/environments';
import tagGridActionsStyles from '../tagGridActionsStyles';
import classNames from 'classnames'
import { getChildWorkFlowDetails } from '../../tagGrid/tagActions/TagActionUtil';
import { getSelectedBuilderTagEnabled, isProductFamilySupported } from '../../../projectInfoUtil';

const ExportToQuotePro = (props) => {
    const { inlineDisplay, margin1, disabledIcon } = tagGridActionsStyles()
    const { IsExportToQP, ProductFamily } = tagDataKeys;
    const { tagGridAction, project, lang, selectedTags, dispatch, builderList } = props;
    const [quoteProText, setQuoteProText] = useState(translation('ExportToQuotePro'));
    const isSelectedRegionUnique = [...new Set(selectedTags.map(tag => tag.ProductBuilder))];
    const productFamilyUniqueSupported = isProductFamilySupported(selectedTags, IsExportToQP, ProductFamily)
    const isAllTagsEnabledForQuote = getSelectedBuilderTagEnabled(selectedTags, IsExportToQP)
    const disabled = !(isSelectedRegionUnique.length === 1 || productFamilyUniqueSupported) || !isAllTagsEnabledForQuote
    const iconClassName = disabled ? classNames(disabledIcon, margin1) : margin1

    useEffect(() => {
        setQuoteProText(translation('ExportToQuotePro'))
    }, [lang]);

    const exportPmt = () => {
        let isHandlerPresent = false;
        for (const tag of selectedTags) {
            const Builder = tag.ProductBuilder;
            const TagModel = tag.TagModel;
            const workflowDetails = getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderList);
            const { visible, onClick } = workflowDetails.workflow.isExportToQuoteBuilderSupported;
            if (visible && onClick) {
                onClick(dispatch);
                isHandlerPresent = true;
                break;
            }
        }
        !isHandlerPresent && window.open(`${appConfig.api.exportPMT}${project.ProjectID}`, '_blank');
    }

    return (tagGridAction[IsExportToQP] && 
        <div className={inlineDisplay}>
            <CustomButton
                id='exportPmt'
                name={quoteProText}
                onClick={exportPmt}
                disabled={disabled}
                iconProps={{ icon: '/Images/Subtract.png', className: iconClassName, alt: quoteProText }}
            />
        </div>
    )
}

const mapStateToProps = state => ({
    selectedTags: state.tagList.selectedTags,
    lang: state.locale.leafLocale,
    tagGridAction: state.tagList.tagGridActions,
    project: state.createNewProject.projectData,
    builderList: state.getAllProductsReducer.builderList,
});

export default connect(mapStateToProps)(ExportToQuotePro);
