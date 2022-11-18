import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { injectIntl } from "react-intl";
import { SaveTemplate } from '@carrier/ngecat-reactcomponents';
import { fetchExistingTemplateList, actionConstants } from "@carrier/workflowui-globalfunctions"

const SaveTemplateDialog = (props) => {
    const { saveTemplate, eCatAppService, dispatch, intl } = props;
    const { getTemplateList = null, productBuilderId, isTemplateModalOpen } = saveTemplate;

    useEffect(() => {
        (isTemplateModalOpen) && fetchTemplates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTemplateModalOpen]);

    const fetchTemplates = async() => {
        let result
        if (getTemplateList) {
            result = await getTemplateList(eCatAppService)
        }
        else {
            result = await fetchExistingTemplateList(productBuilderId, eCatAppService, intl);
        }
        const { templates = [], errorMsg = "" } = result
        dispatch({
            type: actionConstants.SAVE_TEMPLATE_FETCH,
            data: {
                errorMsg: errorMsg,
                existingTemplates: templates,
                isLoading: false
            }
        })
    }

    return (
        isTemplateModalOpen && <SaveTemplate {...props} />
    )
}

const mapStateToProps = (state) => ({
    saveTemplate: state.saveTemplate,
    eCatAppService: state.api.eCatAppService
});

export default injectIntl(connect(mapStateToProps, null)(SaveTemplateDialog))