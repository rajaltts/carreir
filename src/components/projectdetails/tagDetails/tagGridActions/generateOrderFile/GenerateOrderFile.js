import React, { useEffect, memo, useReducer } from 'react';
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { GenerateOrderFileConfig, init, reducer, generateOrderConstants } from './GenerateOrderFileConfig';
import { CustomGrid, TabsBuilder, translation } from '@carrier/ngecat-reactcomponents';
import ModalWithGrid from "../../../../common/controls/ModalWithGrid/ModalWithGrid";
import {injectIntlTranslation, tagDataKeys, generateOrderReport } from '@carrier/workflowui-globalfunctions';
import { fetchModelIdBasedRecords } from "../../../projectInfoUtil";
import compareGridStyles from "../../../Compare/CompareGridStyles";
import appConfig from '../../../../../Environment/environments';

const GenerateOrderFile = (props) => {
    const { intl, projectID, showGenerateOrderFile, dispatch: reduxDispatch, isLoading, tagList, lang, currentRole } = props;
    const [state, dispatch] = useReducer(reducer, GenerateOrderFileConfig, init);
    const { showDialogLoading, modalDetails, gridDetails, isDataMounted, tabdetails, dropDownDetails } = state;
    const { compareGridRoot, hideComponent, reportList } = compareGridStyles();
    const { IntializeGenerateDropdown, Intialize, UpdateModal, ShowDialogue,
        UpdateGridData, HandleTabChange, UpdateDropdownDetails } = generateOrderConstants

    useEffect(() => {
        if (!isLoading) {
            dropDownDetails.toggleDialogue = toggleGenerateOrder;
            dispatch({ type: IntializeGenerateDropdown, dropDownDetails: dropDownDetails });
            initializeData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, tagList, intl]);

    useEffect(() => {
        dropDownDetails.name = translation(dropDownDetails.name);
        dispatch({ type: UpdateDropdownDetails, dropDownDetails: dropDownDetails });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    const initializeData = () => {
        gridDetails.selectedRecordsHandler = selectedRecordsHandler;
        modalDetails.onClose = closeGenerateOrder;
        modalDetails.actionButtonList[0].onClick = onGenerateOrderClickHandler;
        dispatch({ type: Intialize, gridDetails: gridDetails, modalDetails: modalDetails });
    }

    const closeGenerateOrder = (flag, event) => {
        toggleGenerateOrder(null, null, flag);
    }

    const toggleGenerateOrder = (workflow, childWorkflow, flag) => {
        modalDetails.open = flag;
        let isGenerateOrderSupported =  {};
        if (childWorkflow || workflow) {
            isGenerateOrderSupported = childWorkflow.isGenerateOrderSupported || workflow.isGenerateOrderSupported;
            const builder = childWorkflow.builder || workflow.builder || "";
            const { component = null, onClickHandler = null, isAllCalculationRequired = false } = isGenerateOrderSupported;
            modalDetails.builder = builder;
            modalDetails.reportComponent = component;
            modalDetails.reportClickHandler = onClickHandler;
            modalDetails.workflow = workflow;
            modalDetails.childWorkflow = childWorkflow;
            modalDetails.isAllCalculationRequired = isAllCalculationRequired;
        }
        if (flag) {
            const { maxCountForReport = null } = isGenerateOrderSupported;
            const selectedModelId = childWorkflow.id || workflow.id;
            const { displayName, builder } = childWorkflow.id ? childWorkflow : workflow
            const { IsGenerateOrder } = tagDataKeys;
            const records = fetchModelIdBasedRecords({ uniqueKey: IsGenerateOrder, tagList, selectedModel: displayName, productBuilder: builder, selectedModelId: selectedModelId })
            modalDetails.maxCountForReport = maxCountForReport || records.length;
            updateGridData(records, selectedModelId)
        }
        else {
            tabdetails.selectedTab = 0;
            modalDetails.selectedReportOptions = [];
            modalDetails.reportComponent = null;
            modalDetails.reportClickHandler = null;
            modalDetails.maxCountForReport = null;
            modalDetails.otherControlsData = null;
            updateGridData([]);
            dispatch({ type: HandleTabChange, tabdetails: tabdetails });
        }
        modalDetails.actionButtonList = disableActionButton(true, modalDetails);
        dispatch({ type: ShowDialogue, modalDetails: modalDetails, showDialogLoading: false });
    }

    const updateGridData = (result, selectedModelId = null) => {
        if (selectedModelId) {
            modalDetails.selectedId = selectedModelId;
        }
        else {
            modalDetails.selectedId = modalDetails.defaultSelectedId;
            modalDetails.selectedTags = [];
        }
        const rowsData = result.map(item => {
            return {
                "Id": item.TagId,
                "Selection Name": item.TagName,
                "Model": item.PartNumber
            }
        });
        gridDetails.rowData = rowsData;
        dispatch({ type: UpdateGridData, gridDetails: gridDetails, modalDetails: modalDetails });
    }

    const disableActionButton = (disabled, modalInfo) => {
        return (
            modalInfo.actionButtonList.map((button) => {
                button.disabled = disabled
                return button;
            }))
    }

    const selectedRecordsHandler = (selectedItems) => {
        if((modalDetails.reportComponent && modalDetails.selectedReportOptions === 0) || selectedItems.length === 0) {
            modalDetails.actionButtonList = disableActionButton(true, modalDetails);
            modalDetails.errorMsg = "";
        } else if(selectedItems.length > 0 && selectedItems.length <= modalDetails.maxCountForReport) {
            if(!modalDetails.reportComponent || (modalDetails.reportComponent && modalDetails.selectedReportOptions.length > 0)) {
                modalDetails.actionButtonList = disableActionButton(false, modalDetails);
            }
            modalDetails.errorMsg = "";
        } else if(selectedItems.length > modalDetails.maxCountForReport) {
            const errorMsg = (translation("GenerateOrderReportError","",{_LIMIT_: modalDetails.maxCountForReport}));
            modalDetails.errorMsg = errorMsg;
            modalDetails.actionButtonList = disableActionButton(true, modalDetails);
        }
        modalDetails.selectedTags = selectedItems;
        dispatch({ type: UpdateModal, modalDetails: modalDetails });
    }

    const handleTabChange = (event, value) => {
        if (gridDetails.rowData.length > 0) {
            tabdetails.selectedTab = value;
            dispatch({ type: HandleTabChange, tabdetails: tabdetails });
        }
    }

    const saveSelectedReportOptions = ({ selectedList, otherControlsData = {} }) => {
        let checkedIds = [];
        if (selectedList.length > 0) {
            checkedIds = selectedList;
        }
        modalDetails.selectedReportOptions = checkedIds;
        modalDetails.otherControlsData = otherControlsData;
        modalDetails.actionButtonList = disableActionButton(
            checkedIds.length === 0 || 
            (modalDetails.selectedTags.length === 0 || modalDetails.selectedTags.length > modalDetails.maxCountForReport), 
            modalDetails
        );
        dispatch({ type: UpdateModal, modalDetails: modalDetails });
    }

    const createReportOptions = () => {
        if (modalDetails.reportComponent) {
            return React.createElement(modalDetails.reportComponent, {
                updateReportState: saveSelectedReportOptions,
                workflow: modalDetails.workflow,
                childWorkflow: modalDetails.childWorkflow,
                isGenerateOrderFile: true
            });
        }
        return null
    }

    const onGenerateOrderClickHandler = () => {
        const { selectedId, builder, selectedTags, selectedReportOptions, childWorkflow,
            workflow, isAllCalculationRequired, otherControlsData } = modalDetails;
        const generateOrderModalDetails = {
            selectedId,
            builder,
            selectedTags,
            selectedReportOptions,
            childWorkflow,
            workflow,
            isAllCalculationRequired,
            otherControlsData,
        };
        const generateOrderData = {
            projectID,
            modalDetails: generateOrderModalDetails,
            lang,
            currentRole,
            progressMessage: translation("GENERATE_ORDER_PROGRESS"),
            failMessage: translation("GENERATE_ORDER_FAILURE"),
            tagLockWarningMessage :injectIntlTranslation(intl, "TagLockWarningMessage"),
            dispatch: reduxDispatch
        }
        if (modalDetails.reportClickHandler) {
            modalDetails.reportClickHandler({
                apiList: appConfig.api,
                ...generateOrderData
            });
        } else {
            generateOrderReport({
                apiUrl: appConfig.api.eCatAppService,
                ...generateOrderData
            })
        }
        toggleGenerateOrder(null, null, false);
    }

    return (
        <>
            { (isDataMounted && showGenerateOrderFile) &&
                <ModalWithGrid
                    showDialogLoading={showDialogLoading}
                    modalDetails={modalDetails}
                    gridDetails={gridDetails}
                    dropDownDetails={dropDownDetails}
                    showComponent={true}
                    fullWidth
                >
                    <>
                        {modalDetails.reportComponent &&
                            <TabsBuilder
                                tabs={tabdetails.tabs}
                                selectedTab={tabdetails.selectedTab}
                                handleTabChange={handleTabChange}
                            />
                        }
                        <div className={(tabdetails.selectedTab === 1) ? reportList : hideComponent}>
                            {createReportOptions()}
                        </div>
                        <div className={(tabdetails.selectedTab !== 0) && hideComponent}>
                            <CustomGrid
                                gridClassName={compareGridRoot}
                                rows={gridDetails.rowData}
                                headCells={gridDetails.headerData}
                                showCheckbox={gridDetails.showCheckbox}
                                orderByfield={gridDetails.orderByfield}
                                uniqueKey={gridDetails.uniqueKey}
                                sortable
                                hideSearch
                                rowCheckboxHandler={gridDetails.selectedRecordsHandler}
                                rowsPerPageOptions={[5, 10, 20, 100]}
                                config={gridDetails.config || {}}
                                rowsToShowPerPage={100}
                                isLoading={showDialogLoading}
                                singleSelectGrid={gridDetails.singleSelectGrid}
                                selectedRows={modalDetails.selectedTags || []}
                                doNotTranslate={false}
                            />
                        </div>
                    </>
                </ModalWithGrid>
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        tagList: state.tagList.tags,
        isLoading: state.tagList.isLoading,
        lang: state.locale.leafLocale,
        currentRole: state.locale.role,
        showGenerateOrderFile: state.tagList.tagGridActions[tagDataKeys.IsGenerateOrder],
        projectID: state.createNewProject.projectData.ProjectID
    };
};

export default injectIntl(withRouter(
 connect(mapStateToProps, null)(memo(GenerateOrderFile))
));