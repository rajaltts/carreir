import React, { useContext } from "react";
import { connect } from 'react-redux';
import { injectIntl } from "react-intl";
import { CustomGrid } from "@carrier/ngecat-reactcomponents";
import { upsertTagGridColumnSettings } from '../../../../redux/Actions/getTagList';
import { injectIntlTranslation, sortingOrder, multiTagEditGridColumn, extractDataFromRules, tagGridColumn } from '@carrier/workflowui-globalfunctions';
import { multiTagGridConfig } from './multiTagGridConfig';
import projectGridStyles from '../../../dashboard/projectList/projectGridStyles';
import classNames from 'classnames';
import multiTagEditStyles from '../multiTagEditStyles';
import { MultiTagContext } from '../multiTagContext'
import { MULTI_TAG_GRID_COLUMN_SETTING } from "../../../../utilities/constants/Constants";
import { columnType } from '@carrier/workflowui-globalfunctions';
import RuleBasedFormBuilderField from './multiTagActions/ruleBasedComponents/ruleBasedFormBuilderField';
import Typography from '@material-ui/core/Typography';

const MultiTagGrid = (props) => {
  const { intl, isLoading, tagGridColumnSettings, upsertTagGridColumnSettings, lang, messages } = props;
  const { checkTagQuantityHandler, columnHeader = [], resetGrid, updateGridActions, multiTagList, gridUniqueKey,
    onNewAssignmentChange, columnDetailsInfo, rulesLoading, multiInvalidTagList, translationsData, invalidatedTags,
    setInvalidatedTags, copyAction, pasteAction, gridActions } = useContext(MultiTagContext)
  const { multiTagGrid, tableTd, gridWrapper, removeMaxHeight, gridWrapperBottom, unavailbleText, unavailableGrid, 
    disableCell, checkBoxCell } = multiTagEditStyles();
  const { gridRoot, rowClassName, tdClassName } = projectGridStyles();
  const getHeaderData = () => {
    const { Actions, SelectionName, Model, Qty } = multiTagEditGridColumn;
    let defaultColumns = [
      {name: Model,displayName: injectIntlTranslation(intl, "SModel"),disableSorting: true,isSelected: true,isDefaultSelection: true,disabled: true,className: classNames(tdClassName, tableTd)},
      {name: SelectionName,displayName: injectIntlTranslation(intl, "SelectionName"),disableSorting: true,isSelected: true,isDefaultSelection: true,disabled: true,className: classNames(tdClassName, tableTd)},
      {name: Qty,displayName: injectIntlTranslation(intl, "SSQuantity"),disableSorting: true,isSelected: true,isDefaultSelection: true,disabled: true,className: classNames(tdClassName, tableTd)},
    ];
    let columns = columnHeader.map((col) => {
      return {
        name: col,
        displayName: injectIntlTranslation(intl, col),
        disableSorting: true,
        isSelected: isHeaderSelected(col, false),
        isDefaultSelection: false,
        disabled: false,
        className: classNames(tdClassName, tableTd),
      };
    });
    const concatedColumns = columns.concat(defaultColumns);
    const newColumns = new Map();
    for (const col of concatedColumns) {
      newColumns.set(col.displayName, col);
    }
    let columnDetails = [...newColumns.values()].sort((a, b) => {return (b.disabled - a.disabled)})
    let actionCol = [{name: Actions, displayName: injectIntlTranslation(intl, " "), disableSorting: true, className: classNames(tdClassName, tableTd), isSelected: true, isDefaultSelection: true, disabled: true, shouldDisplayInPicker: false }]
    return [...actionCol, ...columnDetails];
  };
  
  const isHeaderSelected = (columnName, defaultSelection) => {
    if (tagGridColumnSettings.length) {
      return (tagGridColumnSettings.indexOf(columnName) > -1);
    }
    else if (tagGridColumnSettings.length === 0) {
      return true
    }
    return defaultSelection;
  }

  const getColumnInfo = (productType, columnName, tagModel) => {
    if (productType && columnDetailsInfo[columnName] && columnDetailsInfo[columnName][productType]) {
      return columnDetailsInfo[columnName][productType][tagModel]
    }
    return {}
  }

  const createGridConfig = (columnHeader = {}) => {
    let newGridConfig = {}
    columnHeader.forEach(column => {
      newGridConfig[column] = {
        lookUpKey: column,
        columnType: columnType.customComponent,
        isEditable: true,
        component: RuleBasedFormBuilderField,
        onChange: onNewAssignmentChange,
        getColumnInfo: getColumnInfo,
        isCellHighlightEnabled: true
      }
    });
    return {
      ...multiTagGridConfig,
      ...newGridConfig
    }
  }

  const saveColumnOptions = (newHeaderCells) => upsertTagGridColumnSettings(newHeaderCells, MULTI_TAG_GRID_COLUMN_SETTING);
  const config = createGridConfig(columnHeader)
  const headers = getHeaderData()

  const updateTagQuantityHandler = async (event, editedValue, rowData, rowIndex) => {
    checkTagQuantityHandler(rowData,editedValue);
  }

  const validateTagQty = (editedValue, rowData) => {
    editedValue = String(editedValue)
    let validateMessage = ''
    if (editedValue === "0") {
        validateMessage = "QuantityZero"
    }
    else if(parseInt(editedValue) < 0){
      validateMessage = "NegativeQtyValue"
    }
    else if ((!editedValue || !editedValue.trim()) || !(!isNaN(editedValue) && Number.isInteger(parseFloat(editedValue)))) {
        validateMessage = "ValidationValidNumber"
    }
    const qtyTagIndex = invalidatedTags.indexOf(rowData.TagId);
    if (!validateMessage) {
      if (qtyTagIndex > -1) {
        setInvalidatedTags(invalidatedTags.filter(tagId => tagId !== rowData.TagId))
        checkTagQuantityHandler(rowData, editedValue);
      }
    }
    return validateMessage
  }

  const showCellError = (tagData, columnName) => {
    if (columnName === multiTagEditGridColumn.Qty) {
      return validateTagQty(tagData.TagQty, tagData) ? true : false
    }
    else {
      const productType = tagData?.UIBuilderDetails?.GridActions?.IsMultiTagEdit?.configuration?.ProductType
      const modelPropName = tagData?.UIBuilderDetails?.GridActions?.IsMultiTagEdit?.configuration?.modelPropName
      const ruleJson = tagData?.UIBuilderDetails?.ConfigurationRulesData?.VariableDomains || {}
      const { value: model = tagData.TagModel } = extractDataFromRules(ruleJson, modelPropName, intl);
      const {
          rulePropName: lookUpKey = ''
      } = getColumnInfo(productType, columnName, model) || {}
      const { valid = false, relaxed } = extractDataFromRules(ruleJson, lookUpKey, intl);
      return !valid || relaxed
    }
  }
  
  multiTagGridConfig[multiTagEditGridColumn.SelectionName].cellClassName = disableCell;
  multiTagGridConfig[multiTagEditGridColumn.Model].cellClassName = disableCell;
  multiTagGridConfig[multiTagEditGridColumn.Qty].onDoubleClick = updateTagQuantityHandler;
  multiTagGridConfig[multiTagEditGridColumn.Qty].validations = { validation: validateTagQty }

  const copyTagHandler = () => {
    if (gridActions.copyTag && copyAction) {
      copyAction()
    }
  }

  const pasteTagHandler = () => {
    if (gridActions.pasteTag && pasteAction) {
      pasteAction()
    }
  }
  
  return (
    <>
      <div id="MultiTagGrid" className={gridWrapper}>
        <CustomGrid
          gridClassName={classNames(gridRoot, multiTagGrid, removeMaxHeight)}
          rowClassName={rowClassName}
          showCheckbox={true}
          headCells={headers}
          orderByfield={tagGridColumn.DateModified}
          columnPicker={!!columnHeader.length}
          rows={multiTagList}
          isLoading={isLoading && !multiTagList.length}
          doNotTranslate={false}
          config={config}
          hideSearch
          sortable
          hidePagination
          stateLessGrid
          sorting={sortingOrder.descending}
          editMode={{
            enable: true,
            editModeHighlight: true,
            editModeSelectionsHandler: updateGridActions,
            copyAction: copyTagHandler,
            pasteAction: pasteTagHandler
          }}
          uniqueKey={gridUniqueKey}
          showDivider
          showLinearProgress={(isLoading && !!multiTagList.length) || rulesLoading}
          hideHeader={!columnHeader.length}
          reset={resetGrid}
          saveColumnHandler={saveColumnOptions}
          isKeyBoardAccessible
          showCellError={showCellError}
          customTranslations={{
            translations: translationsData,
            translationsUniqueKey: "ProductBuilder",
            lang: lang,
            messages: messages
          }}
          checkBoxClassname={checkBoxCell}
        />
      </div>
      <div id="unAvailableMultiTagGrid" className={classNames(gridWrapper, gridWrapperBottom)}>
        <Typography variant="h6" className={unavailbleText}>
          {injectIntlTranslation(intl, "Unavailable")}
        </Typography>
        <CustomGrid
          gridClassName={classNames(gridRoot, multiTagGrid, unavailableGrid, removeMaxHeight)}
          rowClassName={rowClassName}
          showCheckbox={false}
          headCells={headers}
          orderByfield={tagGridColumn.DateModified}
          rows={multiInvalidTagList}
          isLoading={isLoading && !multiInvalidTagList.length}
          doNotTranslate={false}
          columnPicker={!!columnHeader.length}
          config={config}
          hideSearch
          sortable
          hidePagination
          sorting={sortingOrder.descending}
          uniqueKey={gridUniqueKey}
          showDivider
          hideHeader
          showLinearProgress={isLoading && !!multiInvalidTagList.length}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  lang: state.locale.lang,
  messages: state.locale.message,
  isLoading: state.tagList.isLoading,
  tagGridColumnSettings: (state.userProfile.userColumnSettings[MULTI_TAG_GRID_COLUMN_SETTING] || [])
});

export default injectIntl(connect(mapStateToProps, { upsertTagGridColumnSettings})(MultiTagGrid));