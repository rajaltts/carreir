import React, { useEffect, memo, useReducer } from 'react';
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { CompareConfig, init, reducer } from './CompareConfig';
import { CustomGrid, TabsBuilder, translation } from '@carrier/ngecat-reactcomponents';
import ModalWithGrid from "../../common/controls/ModalWithGrid/ModalWithGrid";
import { tagDataKeys } from '@carrier/workflowui-globalfunctions';
import { fetchModelIdBasedRecords } from "../projectInfoUtil";
import compareGridStyles from "./CompareGridStyles";
import appConfig from '../../../Environment/environments';

const Compare = (props) => {
    const { projectID, showCompare, dispatch: reduxDispatch, currentRole, isLoading, lang, tagList } = props;
    const [state, dispatch] = useReducer(reducer, CompareConfig, init);
    const { showDialogLoading, modalDetails, gridDetails, isDataMounted, tabdetails, dropDownDetails } = state;
    const { compareGridRoot, hideComponent, reportList } = compareGridStyles();

    useEffect(() => {
        return () => dispatch({ type: 'reset' })
    }, []);

    useEffect(() => {
        if (!isLoading) {
            dropDownDetails.toggleDialogue = toggleCompare;
            dispatch({ type: 'intializeCompareDropdown', dropDownDetails: dropDownDetails });
            initializeData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, tagList]);

    useEffect(() => {
        dropDownDetails.name = translation(dropDownDetails.name);
        dispatch({ type: 'updateDropdownDetails', dropDownDetails: dropDownDetails });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang.lang]);

    const initializeData = () => {
        gridDetails.selectedRecordsHandler = selectedRecordsHandler;
        modalDetails.onClose = toggleCompare;
        modalDetails.actionButtonList[0].onClick = onCompareClickHandler;
        dispatch({ type: 'intialize', gridDetails: gridDetails, modalDetails: modalDetails });
    }

    const toggleCompare = (workflow, childWorkflow, flag) => {
        modalDetails.open = flag;
        if (childWorkflow || workflow) {
            const isCompareSupported = childWorkflow.isCompareSupported || workflow.isCompareSupported || {};
            const builder = childWorkflow.builder || workflow.builder || "";
            const { component = null, onClickHandler = null } = isCompareSupported;
            modalDetails.builder = builder;
            modalDetails.reportComponent = component;
            modalDetails.reportClickHandler = onClickHandler;
            modalDetails.workflow = workflow;
            modalDetails.childWorkflow = childWorkflow;
        }
        if (flag) {
            const selectedModelId = childWorkflow.id || workflow.id;
            const { displayName, builder } = childWorkflow;
            const { IsCompare } = tagDataKeys;
            const records = fetchModelIdBasedRecords({ uniqueKey: IsCompare, tagList, selectedModel: displayName, productBuilder: builder })
            updateGridData(records, selectedModelId)
        }
        else {
            tabdetails.selectedTab = 0;
            modalDetails.selectedReportOptions = [];
            modalDetails.reportComponent = null;
            modalDetails.reportClickHandler = null;
            updateGridData([]);
            dispatch({ type: 'handleTabChange', tabdetails: tabdetails });
        }
        modalDetails.actionButtonList = enableActionButton(true, modalDetails);
        dispatch({ type: 'showDialogue', modalDetails: modalDetails, showDialogLoading: false });
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
        dispatch({ type: 'updateGridData', gridDetails: gridDetails, modalDetails: modalDetails });
    }

    const enableActionButton = (disabled, modalInfo) => {
        return (
            modalInfo.actionButtonList.map((button) => {
                button.disabled = disabled
                return button;
            }))
    }

    const selectedRecordsHandler = (selectedItems) => {
        modalDetails.actionButtonList = enableActionButton((!(selectedItems.length >= 2) || !(modalDetails.selectedReportOptions.length > 0)), modalDetails);
        modalDetails.selectedTags = selectedItems;
        dispatch({ type: 'updateModal', modalDetails: modalDetails });
    }

    const handleTabChange = (event, value) => {
        if (gridDetails.rowData.length > 0) {
            tabdetails.selectedTab = value;
            dispatch({ type: 'handleTabChange', tabdetails: tabdetails });
        }
    }

    const saveSelectedReportOptions = ({ selectedList, otherControlsData = {} }) => {
        let checkedIds = [];
        if (selectedList.length > 0) {
            checkedIds = selectedList;
        }
        modalDetails.selectedReportOptions = checkedIds;
        modalDetails.otherControlsData = otherControlsData;
        modalDetails.actionButtonList = enableActionButton((!(checkedIds.length > 0) || !(modalDetails.selectedTags.length >= 2)), modalDetails);
        dispatch({ type: 'updateModal', modalDetails: modalDetails });
    }

    const createReportOptions = () => {
        if (modalDetails.reportComponent) {
            return React.createElement(modalDetails.reportComponent, {
                updateReportState: saveSelectedReportOptions,
                workflow: modalDetails.workflow,
                childWorkflow: modalDetails.childWorkflow
            });
        }
        return null
    }

    const onCompareClickHandler = () => {
        const { selectedId, builder, selectedTags, selectedReportOptions, otherControlsData, childWorkflow } = modalDetails;
        const compareModalDetails = {
            selectedId,
            builder,
            selectedTags,
            selectedReportOptions,
            otherControlsData,
            childWorkflow
        }       
        if (modalDetails.reportClickHandler) {
            modalDetails.reportClickHandler({
                apiUrl: appConfig.api.eCatAppService,
                projectID,
                modalDetails: compareModalDetails,               
                lang,
                currentRole,
                dispatch: reduxDispatch,
                api: appConfig.api
            });
        }
        toggleCompare(null, null, false);
    }

    return (
        <>
            {(isDataMounted && showCompare) &&
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
        lang: state.locale,
        currentRole: state.locale.role,
        showCompare: state.tagList.tagGridActions[tagDataKeys.IsCompare],
    };
};

export default injectIntl(withRouter(
    connect(mapStateToProps, null)(memo(Compare))
));