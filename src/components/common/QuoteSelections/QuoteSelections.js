import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { QuoteSelectionProgressDialog, QuoteSelectionSuccessDialog, QuoteSelection } from '@carrier/ngecat-reactcomponents';
import { injectIntl } from 'react-intl';
import { getChildWorkFlowDetails } from '../../projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil';

const QuoteSelections = (props) => {
    const { quoteSelection, errorHandler, builderDetails, selectedTags, apis } = props;
    const { showSuccessModal, showQuoteSelectionModal, showProgressModal, errorMsg } = quoteSelection;

    useEffect(() => {
        if (errorMsg && errorHandler) {
            errorHandler(errorMsg)
        }
    }, [errorMsg])

    const loadDialog = () => {
        if (showQuoteSelectionModal) {
            const Builder = selectedTags[0].ProductBuilder;
            const TagModel = selectedTags[0].TagModel;
            const builderList = getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderDetails);
            return <QuoteSelection {...props} builderList={builderList}/>
        }
        if (showProgressModal) {
            return <QuoteSelectionProgressDialog {...props}/>
        }
        if (showSuccessModal) {
            return <QuoteSelectionSuccessDialog {...props}/>
        }
        return <></>
    }

    return loadDialog()
}

const mapStateToProps = (state) => ({
    quoteSelection: state.quoteSelection,
    selectedTags: state.tagList.selectedTags,
    builderDetails: state.getAllProductsReducer.builderList,
    apis: state.api
});

export default injectIntl(connect(mapStateToProps, null)(QuoteSelections));