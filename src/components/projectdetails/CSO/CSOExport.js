import React, { useEffect, memo, useReducer } from 'react';
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { getAllProjectDetailList } from "../../../redux/Actions/getProjectdetailList";
import { getCalcType, csoCalculation, downLoadCd5MSFile } from "../../../redux/Actions/csoCalculationAction";
import { connect } from "react-redux";
import ModalWithGrid from "../../common/controls/ModalWithGrid/ModalWithGrid";
import { CSOExportConfig, init, reducer, csoInput } from './CSOExportConfig';
import CustomLoader from "../../common/controls/CustomLoader/customLoader";
import { getLanguageDetails } from '../../../utilities/languagesutils';
import { translation } from '@carrier/ngecat-reactcomponents';
import CsoInputs from './csoInputs';
import { getGridActionForTag } from '../projectInfoUtil';
import appConfig from '../../../Environment/environments';
import './cso.scss';
import moment from 'moment';
import { tagDataKeys, showSuccessNotification, showErrorNotification, showInfoNotification, hideNotification, showLoader, hideLoader, showWarningNotification, guid, endPoints, runCsoCalculation, ApiService } from '@carrier/workflowui-globalfunctions';

function CSOExport(props) {
    const { projectID, getAllProjectDetailList, lang, getCalcType, csoCalculation, currentRole, popupBlockAction, showCSOExport, showLoader, hideLoader, hideNotification, tagList, groups, eCatApimAppService, rulesAppServices, calcEngine, fullName} = props;
    const [state, dispatch] = useReducer(reducer, CSOExportConfig, init);
    const { showDialogLoading, dropDownDetails, modalDetails, gridDetails, isDataMounted, loading, csoInputsDialougeVisible, tag } = state;

    useEffect(() => {
        const gridData = gridDetails;
        const dropDowndata = dropDownDetails;
        const modalData = modalDetails;
        gridData.selectedRecordsHandler = selectedRecordsHandler;
        dropDowndata.toggleDialogue = openCSODialogue;
        modalData.onClose = toggleCSODialogue;
        modalData.actionButtonList[0].onClick = onCsoExportClick;
        dispatch({ type: 'intialize', gridDetails: gridData, dropDownDetails: dropDowndata, modalDetails: modalData });
        return () => dispatch({ type: 'reset' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList]);

    useEffect(() => {
        dropDownDetails.name = translation(dropDownDetails.name);
        dispatch({ type: 'updateDropdownDetails', dropDownDetails: dropDownDetails });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang.lang]);

    const openCSODialogue = (workflow, childWorkflow) => {
        const isMultiSelect = childWorkflow.isCsoExportSupported ? childWorkflow.isCsoExportSupported.multiSelect : workflow.isCsoExportSupported.multiSelect;
        modalDetails.CSOExport = childWorkflow.isCsoExportSupported ? childWorkflow.isCsoExportSupported : workflow.isCsoExportSupported;
        modalDetails.createCalcInputFromCalcMS = childWorkflow.isCsoExportSupported ? childWorkflow.isCsoExportSupported.onCreateInputXML : workflow.isCsoExportSupported.onCreateInputXML;
        modalDetails.productLine = workflow.productLine || modalDetails?.CSOExport?.productLine
        modalDetails.version = workflow.release.builderVersion
        if (isMultiSelect) {
            gridDetails.singleSelectGrid = false;
            const limit = childWorkflow.isCsoExportSupported ? childWorkflow.isCsoExportSupported.maxCountForReport : workflow.isCsoExportSupported.maxCountForReport;
            if (limit && limit > 0) {
                let error = (translation("GenerateOrderReportError","",{_LIMIT_:limit}));
                gridDetails.errorMsg = error;
                gridDetails.maxLimit = limit;
            }
        }
        else {
            gridDetails.singleSelectGrid = true;
        }
        dispatch({ type: 'updateSelectionType', gridDetails: gridDetails });
        const selectedModelId = childWorkflow.id || workflow.id;
        const isCsoInputSupported = childWorkflow.isCsoInputSupported || workflow.isCsoInputSupported;
        toggleCSODialogue(true, selectedModelId, isCsoInputSupported);
    }

    const toggleCSODialogue = (flag, selectedModelId = "", isCsoInputSupported = false) => {
        const modalInfo = modalDetails;
        modalInfo.open = flag;
        
        if (flag) {
            modalInfo.actionButtonList = enableActionButton(true, modalInfo);
            modalInfo.errorMsg = '';
            dispatch({ type: 'showDialogue', modalDetails: modalInfo, showDialogLoading: true });
            getAllProjectDetailList(projectID, selectedModelId, currentRole, updateGridData, false, isCsoInputSupported);
        }
        else {
            updateGridData([]);
            modalInfo.csoPoints = [];
            dispatch({ type: 'emptyCSOPointsAndTag', modalDetails: modalInfo });
        }
    }

    const updateGridData = (result, selectedModelId = null, builderId = null, IsSAPSupported = false, tagActions) => {
        const gridInfo = gridDetails;
        const modalInfo = modalDetails;
        modalInfo.selectedId = selectedModelId;
        modalInfo.productBuilderId = builderId;
        modalInfo.IsSAPSupported = IsSAPSupported;
        
        result = result.filter(item=> {
            const output = tagList.find(tag=>tag.TagId === item.TagId);
            if (output && getGridActionForTag(tagDataKeys.IsCsoExport, output)) {
                return true;
            }
            return false;
        });
        
        let rowsData = [];
        if (!modalInfo.IsSAPSupported) {
            gridInfo.headerData = gridInfo.naHeaderData;
            rowsData = result.map(item => {                
                return {
                    "Id": item.TagId,
                    "Tag Name": item.TagName,
                    "Part No": item.PartNumber
                }
            });
        }
        else {
            const csoInputText = "CSO Inputs";
            gridInfo.headerData = gridInfo.emeaHeaderData;
            gridInfo.config = csoInput;
            csoInput[csoInputText].onClick = displayCSOInput;
            rowsData = result.map(item => {
                return {
                    "Id": item.TagId,
                    "Tag Name": item.TagName,
                    "Part No": item.PartNumber,
                    csoInputText: csoInput[csoInputText]
                }
            });
        }
        modalDetails.result = result;
        gridInfo.rowData = rowsData;
        dispatch({ type: 'updateGridData', gridDetails: gridInfo, modalDetails: modalInfo });
    }

    const displayCSOInput = (data) => {
        const tagData = modalDetails.result.filter(item => item.TagId === data.Id);
        dispatch({ type: 'enableCSOInputAndUpdateTag', tag: tagData[0] });
    }

    const saveCsoInputValues = (csoInputsData, noOfInputs) => {
        if (csoInputsData && noOfInputs) {
            const csoPointsData = [{
                tagId: tag.TagId,
                tagName: tag.TagName,
                numberOfCSOPoints: noOfInputs.Value,
                entCodTempList: csoInputsData
            }];
            const modalInfo = modalDetails;
            modalInfo.csoPoints = csoPointsData;
            dispatch({ type: 'updateSelectedRecord', modalDetails: modalInfo });
        }
    }

    const enableActionButton = (disabled, modalInfo) => {
        return (
            modalInfo.actionButtonList.map((button) => {
                button.disabled = disabled
                return button;
            }))
    }

    const selectedRecordsHandler = (selectedItems) => {
        const modalInfo = modalDetails;
        const gridData = gridDetails;
        if (gridData.maxLimit) {
            modalInfo.actionButtonList = enableActionButton(!(selectedItems.length > 0 && selectedItems.length <= gridData.maxLimit), modalInfo);
            if (selectedItems.length > gridData.maxLimit) {
                modalInfo.errorMsg = gridData.errorMsg;
            }
            else {
                modalInfo.errorMsg = ''
            }
        }
        else {
            modalInfo.actionButtonList = enableActionButton(!(selectedItems.length > 0), modalInfo);
        }
        modalInfo.selectedTags = selectedItems && selectedItems.map(item => item.Id);

        if (!!modalInfo.csoPoints.length && (!modalInfo.selectedTags.includes(modalInfo.csoPoints[0].tagId))) {
            modalInfo.csoPoints = [];
        }

        dispatch({ type: 'updateSelectedRecord', modalDetails: modalInfo });
    }

    const onCsoExportClick = () => {
        showLoader()
        getCalcType(modalDetails.productBuilderId, CreateInputXMLsCallback);
    }

    const CreateInputXMLsCallback = async (calcDetails)=>{
        modalDetails.taglist = tagList;
        if(modalDetails.createCalcInputFromCalcMS)
        {
            const tagInputXMLs = await modalDetails.createCalcInputFromCalcMS(modalDetails,calcDetails,appConfig.api);
            initiateCSOCalculation(calcDetails,tagInputXMLs)
        }
        else
        {
            initiateCSOCalculation(calcDetails);
        }
    }

    const runMSCSOCalculation = async (tagName, passedTags, failedTags) => {
        const groupId = groups[0].groupId
        const getTagDataUrl = `${eCatApimAppService}${endPoints.GET_TAG_INFORMATION}`;
        const initialAssignments = [
            { Name: 'User_sUnit', Value: lang.unit === 'Metric' ? 'SI' : 'IP' },
            { Name: 'Report_bCSOExport', Value: "TRUE" }
        ]
        let csoInputs = []
        if (!!modalDetails.csoPoints.length) {
            const csoInputsData = modalDetails.csoPoints.filter(csoInput => csoInput.tagName = tagName)
            if (!!csoInputsData.length) {
                csoInputs = [
                    ...(csoInputsData[0].entCodTempList || []),
                    { Name: 'CSO_nNbrCSOPoints', Value: csoInputsData[0].numberOfCSOPoints }
                ]
            }
        }
        const { calculationMsHandler, modelPropName = null } = modalDetails.CSOExport
        const props = {
            calcEngineUrl: calcEngine, 
            getTagDataUrl: getTagDataUrl,
            rulesUrl: rulesAppServices,
            groupId: groupId,
            productName: modalDetails.productBuilderId,
            productVersion: modalDetails.version,
            requestId: guid(),
            selectedTags: modalDetails.selectedTags,
            defaultAssignmentInput: [...initialAssignments, ...csoInputs],
            modelPropName: modelPropName,
            productLine: modalDetails.productLine
        }

        const exportHandler = calculationMsHandler ? calculationMsHandler : runCsoCalculation
        const { result, error } = await exportHandler({ ...props })
        if (error) {
            failedTags[tagName] = error
        }
        else {
            passedTags[tagName] = result
        }
    }

    const postMsCsoExport = (passedTags, failedTags) => {
        const { showErrorNotification, showInfoNotification, showSuccessNotification } = props
        let successList = []
        hideLoader()
        hideNotification()
        toggleCSODialogue(false);

        for (const [key, value] of Object.entries(passedTags)) {
            const reportStream = value.data.ReportData
            reportStream && downLoadCd5MSFile(value.data.ReportData, key)
            successList.push(key)
        }

        if (Object.keys(failedTags).length === modalDetails.selectedTags.length) {
            showErrorNotification(translation("CalculationsFailed"));
        }
        else {
            const failList = Object.keys(failedTags).map(tag => tag);
            if (!!failList.length) {
                showInfoNotification(translation("CsoGenerateSucceedandFailMessage", "", { _SucceedTAGNAME_: successList, _FailedTAGNAME_: failList }));
            } else {
                showSuccessNotification(translation("CsoGenerate", "", { _TAGNAME_: successList }));
            }
        }
    }

    const initiateCSOCalculation = async (calcType, tagInputXMLs = []) => {
        const { runCalcMS = false } = modalDetails.CSOExport
        const tags = [];
        let selectedModelID = null;
        for (let i = 0; i < modalDetails.selectedTags.length; i++) {
            const tagObject = modalDetails.result.filter(item => item.TagId === modalDetails.selectedTags[i]);
            selectedModelID = !!tagObject.length && tagObject[0].SelectedModelId;
            tags.push({
                "SelectionID": modalDetails.selectedTags[i],
                "BuilderID": modalDetails.productBuilderId,
                "TagName": (tagObject.length > 0) ? tagObject[0].TagName : modalDetails.selectedTags[i]
            });
        }
        if (runCalcMS) {
            let passedTags = {}
            let failedTags = {}
            for (const tagData of tags) {
                try {
                    const { TagName, SelectionID } = tagData
                    const Url = `${eCatApimAppService}${endPoints.LOCK_STATUS_FETCH}${SelectionID}`
                    const { data } = await ApiService(Url, 'POST', null, null, null, null)
                    const { UserName = '', RemainingTime = 0 } = JSON.parse(data)
                    if (fullName === UserName || RemainingTime === 0) {
                        await runMSCSOCalculation(TagName, passedTags, failedTags)
                    }
                    else {
                        hideLoader()
                        props.showWarningNotification(translation("TagLockWarningMessage","",{_TAGNAME_: TagName ,_USER_: UserName }));
                    }
                }
                catch (error) {
                    props.showErrorNotification(translation("CalculationsFailed"));
                }
            }
            if (!!Object.keys(failedTags).length || !!Object.keys(passedTags).length) {
                postMsCsoExport(passedTags, failedTags)
            }
        }
        else {
            const localDate = moment().format('MM/DD/YYYY LT');            
    
            const csoRequestObj = {
                "TagIds": tags,
                "BuilderName": modalDetails.productBuilderId,
                "CalcType": calcType.Id,
                "SelectedModel": selectedModelID,
                "Culture": getLanguageDetails(lang.name).fullLangCode,
                "IsCsoPdfFlag": "true",
                "TagXmls": [],
                "csoPoints": modalDetails.csoPoints,
                "CSOFileLocation": "",
                "LocalDate": localDate,
                "Input": [],
                "TagInputXmlList":tagInputXMLs
            }
    
            csoCalculation(csoRequestObj, successCallback, failureCallback, !modalDetails.IsSAPSupported);
        }
    }

    const failureCallback = (errorResponse) => {
        hideLoader()
        hideNotification()
        toggleCSODialogue(false);
        if(("ECatCode" in errorResponse.data) && (errorResponse.data["ECatCode"] === 409)){
          let jsonData = errorResponse.data["Message"] && JSON.parse(errorResponse.data["Message"])
          props.showWarningNotification(translation("TagLockWarningMessage","",{_TAGNAME_: jsonData["TagName"] ,_USER_: jsonData["User"] }));
        }
        else{
          props.showErrorNotification(translation("CalculationsFailed"));
        }
    }

    const successCallback = (isPopUpBlock, tagListStatus) => {
        hideLoader()
        hideNotification()
        toggleCSODialogue(false);

        if (isPopUpBlock) {
            popupBlockAction();
        }
        else {
            // If all are success show Success notification
            const tagsFailList = tagListStatus.filter(item => item.Status === 0);
            if (tagsFailList.length === modalDetails.selectedTags.length) {
                props.showErrorNotification(translation("CalculationsFailed"));
            } else {
                if (tagsFailList.length > 0) {
                    const tagsSuccessList = tagListStatus.filter(item => item.Status === 1);
                    const tagsSuccessNamesList = tagsSuccessList.map(tag => tag.TagName);
                    const tagsFailedNamesList = tagsFailList.map(tag => tag.TagName)
                    props.showInfoNotification(translation("CsoGenerateSucceedandFailMessage","",{_SucceedTAGNAME_: tagsSuccessNamesList ,_FailedTAGNAME_: tagsFailedNamesList }));             
                } else {
                    const tagNames = tagListStatus.map(tag => tag.TagName);
                    props.showSuccessNotification(translation("CsoGenerate","", {_TAGNAME_: tagNames}));               
                }
            }
        }
    }

    const toggleCSOInput = () => {
        dispatch({ type: 'toggleCSOInput' });
    }

    return (
        <>
            {(isDataMounted)
                ?
                <>
                    {(loading) &&
                        <CustomLoader showLoaderImage={true} loadertext="" visible={true} />
                    }
                    <ModalWithGrid
                        showDialogLoading={showDialogLoading}
                        dropDownDetails={dropDownDetails}
                        modalDetails={modalDetails}
                        gridDetails={gridDetails}
                        showComponent={showCSOExport} />
                    {csoInputsDialougeVisible &&
                        <CsoInputs
                            csoInputsDialouge={toggleCSOInput}
                            TagData={tag}
                            saveCsoInputValues={saveCsoInputValues}
                            productLine={modalDetails.productLine}
                        />
                    }
                </>
                :
                null
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.locale,
        currentRole: state.locale.role,
        tagList: state.tagList.tags,
        groups: state.userProfile.groups,
        fullName: state.userProfile.fullName,
        eCatApimAppService: state.api.eCatApimAppService,
        rulesAppServices: state.api.rulesAppServices,
        calcEngine: state.api.calcEngine
    };
};

export default injectIntl(withRouter(
    connect(mapStateToProps, {getAllProjectDetailList, getCalcType, csoCalculation, showSuccessNotification, showErrorNotification, showInfoNotification, showLoader, hideLoader, hideNotification, showWarningNotification})(memo(CSOExport))
));