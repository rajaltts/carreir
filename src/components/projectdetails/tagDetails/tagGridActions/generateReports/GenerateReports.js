import React, { useEffect, useState, Suspense } from 'react';
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { faFileArchive } from "@fortawesome/free-solid-svg-icons";
import { tagDataKeys } from '@carrier/workflowui-globalfunctions';
import CustomButton from '../../../../common/controls/CustomButton';
import tagGridActionsStyles from '../tagGridActionsStyles';
import { getSelectedBuilderTagEnabled } from '../../../projectInfoUtil';
import {getGridActionValueForTag} from '../../../../projectdetails/projectInfoUtil'

const GenerateReports = (props) => {

    const [component, setComponent] = useState(false)
    const [toggleComponent, setToggleComponent] = useState(false);
    const { tags, selectedTagData, tagGridAction} = props;
    const { IsGenerateReports } = tagDataKeys
    
    useEffect(() => {
        if(selectedTagData && !!selectedTagData.length){
            let _component = getGridActionValueForTag('IsGenerateReports', selectedTagData[0], 'component')
            _component && setComponent(_component)
        }
    },[selectedTagData])

    const { inlineDisplay} = tagGridActionsStyles()
    const isSelectedRegionUnique = [...new Set(selectedTagData.map(tag => tag.ProductBuilder))];
    const isAllTagsEnabledForMultiTag = getSelectedBuilderTagEnabled(selectedTagData, IsGenerateReports)
    const disabled = !(isSelectedRegionUnique.length === 1) || !isAllTagsEnabledForMultiTag;
    
    if (!tagGridAction[IsGenerateReports]) {
        return null;
    }

    const hideComponentHandler = () => setToggleComponent(false);

    const showComponent = () => {
        return (
            <Suspense fallback={<span></span>}>
                {React.createElement(component, {dataItem: selectedTagData[0], hideComponent: hideComponentHandler, hideGenerateReport: hideComponentHandler})}
            </Suspense>
        )
    }

    return (
        <div className={inlineDisplay}>
            {(!!tags.length) &&
                <CustomButton
                    id='multiTagEditId'
                    name={"Generate Reports"}  
                    iconProps={{ icon: faFileArchive }}
                    onClick={() => setToggleComponent(true)}
                    disabled = {disabled}
                />
            }
            {!!selectedTagData.length && toggleComponent && component && showComponent()}
        </div>
    )
}

const mapStateToProps = state => ({
    tags: state.tagList.tags,
    builderList: state.getAllProductsReducer.builderList,
    tagGridAction: state.tagList.tagGridActions,
    selectedTagData: state.tagList.selectedTags,
});

export default injectIntl(withRouter(connect(mapStateToProps)(GenerateReports)));
