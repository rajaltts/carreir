import React, { useState, useEffect, useRef } from "react";
import { withRouter } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';
import { sectionAddWrapper, sectionRemoveWrapper } from '../../common/section/sectionWrapper'
import MultiTagHeader from "./MutiTagHeader/multiTagHeader";
import MultiTagGrid from "./MultiTagGrid/multiTagGrid";
import MultiTagFilters from "./MultiTagFilters/multiTagFilters";
import multiTagEditStyles from './multiTagEditStyles';
import tagGridActionConfig from './MutiTagHeader/tagGridActionConfig';
import { MultiTagContext } from './multiTagContext'
import { getTagList, updateConfigurationRulesData, updateMultipleLockState, refreshTagGrid,
  getTagReadonlyColumns, getTagListData } from "./../../../redux/Actions/getTagList";
import { showSuccessNotification, getProjectIdFromUrl, showLoader, hideLoader,
  getFullUrl, breadcrumbText, getProjectDetails, extractDataFromRules, getAssignmentsAfterChanged,
  tagDataKeys, RULES_SUBPROPS, showErrorNotification, refreshProjectList, getBooleanValue, tagActionsType,
  getWorkflowDetails, multiTagEditGridColumn, tagStatus as tagValidStatus, ApiService, guid, injectIntlTranslation
} from "@carrier/workflowui-globalfunctions";
import { connect } from "react-redux";
import { translation } from '@carrier/ngecat-reactcomponents';
import { injectIntl } from "react-intl";
import { deleteMultipleTag } from './../../../redux/Actions/tagActions/deleteAction'
import MultiTagConfirmDialog from './MutiTagHeader/multiTagConfirmDialog';
import ShowInvalidColumnDialog from './MultiTagGrid/showInvalidColumnDialog';
import { tagEdit } from '../../../redux/Actions/tagActions/editTagAction';
import { copyTagMethod } from './../../../redux/Actions/tagActions/copyAction';
import workflowsConfig from '../../WorkflowsConfig';
import { getChildWorkFlowDetails } from "../../projectdetails/tagDetails/tagGrid/tagActions/TagActionUtil";
import { updateTagQuantity } from '../../../redux/Actions/updateTag'

const MultiTagEditInfo = (props) => {
  const { updateTagQuantity, projectData, getTagList, getProjectDetails, builderList, needRefresh,
    location, intl, showSuccessNotification, showErrorNotification, deleteMultipleTag, tagEdit, showLoader, hideLoader,
    tagList, history, rulesApi, calcApi, eCatApimAppService, updateMultipleLockState, refreshTagGrid, translationApi, locale  } = props;
  const { multiTagEditGrid, paddingFromTopForFixedPosition } = multiTagEditStyles();
  const [gridActions, setGridActions] = useState(tagGridActionConfig);
  const [resetGrid, setResetGrid] = useState(false);
  const [selectedColumnsData, setSelectedColumnsData] = useState({});
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [copyData, setCopyData] = useState(null);
  const [gridUniqueKey, setGridUniqueKey] = useState('TagId');
  const [filteredProducts, setFilteredProducts] = useState({});
  const [multiTagList, setMultiTagList] = useState([]);
  const [filteredValidTags, setFilteredValidTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [invalidColumnDialog, setInvalidColumnDialog] = useState(false)
  const [multiInvalidTagList, setMultiInvalidTagList] = useState([]);
  const [tagsFilter, setTagsFilter] = useState({});
  const [columnHeader, setColumnHeader] = useState([]);
  const [deleteTagList, setDeleteTagList] = useState([]);
  const [isAutoValidate, setIsAutoValidate] = useState(false);
  const [columnDetailsInfo, setColumnDetailsInfo] = useState({});
  const [toBeValidatedTags, setToBeValidatedTags] = useState({});
  const [rulesLoading, setRulesLoading] = useState(false);
  const [invalidTagData, setInvalidTagData] = useState([]);
  const [toBeUpdatedQtyTags, setToBeUpdatedQtyTags] = useState([]);
  const [closeMultiTag, setCloseMultiTag] = useState(false);
  const unlockTagOnUnmount = useRef(true);
  const [translationsData, setTranslationsData] = useState(undefined);
  const [oldLang, setOldLang] = useState(undefined);
  const [duplicatedTagList, setDuplicatedTagList] = useState({});
  const [invalidatedTags, setInvalidatedTags] = useState([]);
  const [reRenderGrid, setReRenderGrid] = useState(true);

  useEffect(() => {
    const projId = getProjectIdFromUrl()
    getTagList(projId, true);
    sectionAddWrapper(multiTagEditGrid);
    setGridActions(tagGridActionConfig);
    if (projectData.ProjectID !== projId || !projectData.UserRole) {
      getProjectDetails(projId, translation("GenericErrorMessage"));
    }
    return () => {
      refreshTagGrid();
      sectionRemoveWrapper(multiTagEditGrid);
    }
  }, []);

  useEffect(() => {
    if (!!tagList.length) {
      const { validTags, invalidTags, tagFilters, columnFilter, columnDetails } = setMultiTagConfiguration(tagList);
      setFilteredValidTags(validTags);
      setMultiInvalidTagList(invalidTags);
      setTagsFilter(tagFilters);
      setColumnHeader(columnFilter);
      setColumnDetailsInfo(columnDetails);
      setCloseMultiTag(false);
      setColumnDetailsInfo(columnDetails)
      return () => {
        unlockTags(true, validTags)
      }
    }
  }, [tagList]);

  useEffect(() => {
    if (!!filteredValidTags.length) {
      const { filteredTags } = setMultiTagValidList(filteredValidTags);
      setMultiTagList(filteredTags);
      setResetGrid(true);
    }
    else {
      setMultiTagList([]);
      setColumnHeader([]);
      setColumnDetailsInfo({})
    }
  }, [filteredProducts, filteredValidTags]);

  useEffect(() => {
    needRefresh && getTagList(getProjectIdFromUrl(), true);
  }, [needRefresh]);

  useEffect(() => {
    if (!!tagList.length && oldLang !== locale.lang) {
      setOldLang(locale.lang)
      setTranslationsStrings(tagList)
    }
  }, [locale, tagList]);

  const getFormatedValue = (ruleJson, lookUpKey,) => {
    const { values } = extractDataFromRules(ruleJson, lookUpKey, intl, null)
    return values.map((propValue) => {
      const { label, value, description } = propValue
      return label || value || description
    })
  }

  const unlockTags = async (fromUnmount, validTags) => {
    if (fromUnmount) {
      if (unlockTagOnUnmount.current) {
        await updateMultipleLockState(validTags);
      }
      return;
    }
    unlockTagOnUnmount.current =  false;
    await updateMultipleLockState(multiTagList);
  }

  const getValidTagStatusConfiguration = (validTags, filteredValidTags) => {
    let newFilteredTags = {};
    let validatedTags = [];
    if (filteredValidTags.length === 0) {
      return validTags;
    } else {
      filteredValidTags.forEach((tag) => {
        newFilteredTags[tag.TagId] = tag;
      });
      validatedTags =  validTags.map((tag) => {
        if (newFilteredTags[tag.TagId]) {
          const {error, validation, calculation, save} = newFilteredTags[tag.TagId].validRuleStatus
          if((!error && (validation || calculation || save))){
            return  tag
          }
          else{
            return newFilteredTags[tag.TagId]
          }
        } else {
          return tag;
        }
      });
      return validatedTags;
    }
  };

  const setMultiTagConfiguration = (tags) => {
    const { IsEditSelection } = tagActionsType
    const { Action, Enable } = tagDataKeys
    let toBeValidTags = [];
    let invalidTags = [];
    let tagFilters = {};
    let columnDetails = {};
    for (let tag of tags) {
      const { UIBuilderDetails: { GridActions: { IsMultiTagEdit }, TagActions = [], ConfigurationInputXml, ConfigurationRulesData } } = tag;
      let isStatusValid = true
      TagActions.forEach(tagAction => {
        if (tagAction[Action] === IsEditSelection) {
            isStatusValid = tagAction[Enable]
        }
      })
      if (IsMultiTagEdit && isStatusValid && ConfigurationInputXml && ConfigurationRulesData) {
        if (IsMultiTagEdit["isValid"]) {
          const { configuration: { ProductType, models, modelPropName } } = IsMultiTagEdit;
          const ruleJson = ConfigurationRulesData?.VariableDomains || {}
          const { value: model = tag.TagModel } = modelPropName ? extractDataFromRules(ruleJson, modelPropName, intl) : {};
          if (models && !!models.length) {
            models.filter((modelData) => {
              if (modelData.model.includes(tag.TagModel)) {
                modelData.columns.forEach((column) => {
                  if (columnDetails[column.columnName] && columnDetails[column.columnName][ProductType]) {
                    columnDetails[column.columnName][ProductType] = {
                      ...columnDetails[column.columnName][ProductType],
                      [model]: {
                        ...column,
                        ruleset: modelData.ruleSet,
                        tags: modelData.tags,
                        targetProperties: modelData.targetProperties
                      }
                    }
                  }
                  else {
                    columnDetails[column.columnName] = {...columnDetails[column.columnName], [ProductType]: {}}
                    columnDetails[column.columnName][ProductType] = {
                      [model]: {
                        ...column,
                        ruleset: modelData.ruleSet,
                        tags: modelData.tags,
                        targetProperties: modelData.targetProperties
                      }
                    }
                  }
                });
              }
            });
          }
          toBeValidTags.push(tag);
        }
        else {
          invalidTags.push(tag);
        }
      }
      else {
        invalidTags.push(tag);
      }
    }
    const validTags  = getValidTagStatusConfiguration(toBeValidTags, filteredValidTags);
    validTags.map((tag)=>{
      const { validation = true, calculation = true, save = true, calcError = false, duplicateError = false } = tag.validruleStatus || {}
      return tagStatus(tag, validation, calculation, save, calcError, duplicateError);
    })
    tagFilters = getTagFilters(validTags);
    return { validTags, invalidTags, tagFilters, columnFilter: Object.keys(columnDetails), columnDetails }
  }

  const setMultiTagValidList = (tags) => {
    let filteredTags = [];
    for (let tag of tags) {
      const { UIBuilderDetails: { GridActions: { IsMultiTagEdit: { configuration: { ProductType, models } } } } } = tag;
      if (filteredProducts.hasOwnProperty("All") || filteredProducts.hasOwnProperty(ProductType)) {
        filteredTags.push(tag);
      }
    }
    filteredTags = [... new Set(filteredTags)];
    return { filteredTags }
  }

  const getTagFilters = (tags) => {
    let tagFilters = {};
    for (let tag of tags) {
      const { UIBuilderDetails: { GridActions: { IsMultiTagEdit: { configuration: { ProductType, groupPropName } } } } } = tag;
      const ruleJson = tag?.UIBuilderDetails?.ConfigurationRulesData?.VariableDomains || {};
      if (ProductType) {
        if (tagFilters[ProductType]) {
          tagFilters[ProductType] = [...tagFilters[ProductType], ...[...new Set(getFormatedValue(ruleJson, groupPropName))]]
        } else {
          tagFilters[ProductType] = getFormatedValue(ruleJson, groupPropName);
        }
      }
    }
    return tagFilters
  }

  const getReadonlyColumns = (selectedCols, readonlyCols) => {
    return selectedCols.every(col => readonlyCols.includes(col));
  }

  const hideGridActions = (columnNames,data) => {
    let columnAction = false;
    const { UIBuilderDetails: { GridActions: { IsMultiTagEdit: { configuration: { ProductType } } } } } = data;
    columnNames.forEach((property) => {
      if(property != multiTagEditGridColumn.Qty && columnDetailsInfo[property].hasOwnProperty(ProductType) && columnDetailsInfo[property][ProductType][data.TagModel]){
        columnAction = true;
      }
      else {
        columnAction = false;
      }
    });
    return columnAction;
  }

  const updateGridActions = ({ selectedColumns, selectedRows }) => {
    const newGridActions = { ...tagGridActionConfig }
    resetGrid && setResetGrid(false)
    setSelectedColumnsData(selectedColumns)
    setSelectedRowsData(selectedRows)
    const isRowsSelected = selectedRows.length >= 1
    const isRowSelected = selectedRows.length === 1
    const columnsSelected = Object.keys(selectedColumns).length
    if (isRowSelected || columnsSelected === 1) {
      if(columnsSelected === 1 && !Object.values(selectedColumns)[0].columnNames.includes(multiTagEditGridColumn.Qty)){
        newGridActions.copyTag = hideGridActions(Object.values(selectedColumns)[0].columnNames, Object.values(selectedColumns)[0].rowData)
      }
      else{
        newGridActions.copyTag = true
      }
    }
    if (isRowsSelected && columnsSelected === 0) {
      newGridActions.deleteTag = true
    }
    if (isRowSelected) {
      newGridActions.openTag = !duplicatedTagList[selectedRows[0].TagId];
      newGridActions.duplicateTag = true;
    }
    if (copyData && (isRowsSelected || columnsSelected > 0)) {
      let enablePaste = false
      const isCopyDataAnArray = Array.isArray(copyData)
      const copyInfo = isCopyDataAnArray ? copyData[0] : Object.values(copyData)[0] 
      const productBuilder = copyInfo.ProductBuilder || copyInfo.rowData.ProductBuilder;
      if (isRowsSelected) {
        for(let row in selectedRows){
          if (selectedRows[row].ProductBuilder !== productBuilder) {
            enablePaste = false;
            break;
          }
          else{
            if (Array.isArray(copyData)) {
              enablePaste = true;
            }
            else{
              let checkForcopiedColumns =  getReadonlyColumns(copyInfo.columnNames, getTagReadonlyColumns(copyInfo.rowData))
              if(checkForcopiedColumns){
                enablePaste = false
              }
              else{
                enablePaste = true
              }
            }
          }
        }
      }
      else {
        const selectedCellsData = Object.values(selectedColumns)
        let anyOtherBuilderSelected = false, anyReadOnlyColumnsRow = false, anyHideGridTrue = false, onlyQtyColumnsSelected = false
        for (const selectedColumn of selectedCellsData) {
          if(selectedColumn.rowData.ProductBuilder !== productBuilder && !anyOtherBuilderSelected){
            anyOtherBuilderSelected = true
          }
          if (!anyReadOnlyColumnsRow && getReadonlyColumns(selectedColumn.columnNames, getTagReadonlyColumns(selectedColumn.rowData))) {
            anyReadOnlyColumnsRow = true
          }
          if (selectedColumn.columnNames.length === 1 && selectedColumn.columnNames.includes(multiTagEditGridColumn.Qty)) {
            onlyQtyColumnsSelected = true
          }
          else {
            onlyQtyColumnsSelected = false
          }
          if (!anyHideGridTrue && hideGridActions(selectedColumn.columnNames, selectedColumn.rowData)) {
            anyHideGridTrue = true
          }
        }
        if (Array.isArray(copyData)) {
          if(anyOtherBuilderSelected){
            enablePaste = false
          }
          else{
            enablePaste = !anyReadOnlyColumnsRow
          }
        }
        else {
          if(anyOtherBuilderSelected){
            enablePaste = false
          }
          else{
            if (onlyQtyColumnsSelected) {
              enablePaste = true
            }
            else if(!anyHideGridTrue || !!anyReadOnlyColumnsRow){
              enablePaste = false
            }
            else{
              for (const selectedCells of selectedCellsData) {
                const copyDataCells = Object.values(copyData)[0].columnNames
                const selectedColumns = selectedCells.columnNames
                enablePaste = copyDataCells.some(cell => selectedColumns.includes(cell))
                if (enablePaste) {
                  break
                }
              }
            }
          }
        }
      }
      newGridActions.pasteTag = enablePaste
    }
    setGridActions(newGridActions)
  }

  const deleteAction = () => {
    const newDeletedTagList = [...deleteTagList, ...selectedRowsData]
    const newDuplicatedTagList = {...duplicatedTagList};
    setDeleteTagList(newDeletedTagList.filter(item => {
      let result = true
      const value = newDuplicatedTagList[item.TagId];
      if (value) {
        for (const dupKey in newDuplicatedTagList) {
          if (newDuplicatedTagList[dupKey] === item.TagId) {
            newDuplicatedTagList[dupKey] = value
          }
        }
        delete newDuplicatedTagList[item.TagId];
        result = false;
      }
      if (toBeValidatedTags[item.TagId]) {
        delete toBeValidatedTags[item.TagId];
      }
      return result;
    }));
    setDuplicatedTagList(newDuplicatedTagList)
    
    let newMultiTagList = [...filteredValidTags]
    newMultiTagList = newMultiTagList.filter(list => !newDeletedTagList.some(row => list[gridUniqueKey] === row[gridUniqueKey]));
    if(copyData != null || copyData != undefined){
      const isCopyDataAnArray = Array.isArray(copyData)
      const copyInfo = isCopyDataAnArray ? copyData[0] : Object.values(copyData)[0].rowData
      if (newDeletedTagList.some(data => data.TagId === copyInfo.TagId)) {
        setCopyData(null)
      }
      if (toBeValidatedTags.hasOwnProperty(copyInfo.TagId)) {
        delete toBeValidatedTags[copyInfo.TagId]
      }
    }
    !newMultiTagList.length && setResetGrid(true)
    setFilteredValidTags(newMultiTagList);
    setTagsFilter(getTagFilters(newMultiTagList));
    setCloseMultiTag(true)
  }

  const updateDataforDuplicatedTags = async () => {
    let updatedTagList = [...filteredValidTags]
    let updatedToBeValidatedTags = {...toBeValidatedTags}
    try {
      const tagToBeCopied = [];
      const qtyTagstoBeUpdated = [...toBeUpdatedQtyTags];
      for (const key in duplicatedTagList) {
        const originalTagId = getOriginalTagId(key);
        const duplicatedTag = filteredValidTags.find(item => item.TagId === key)
        const { TagName } = duplicatedTag;
        const originalTag = filteredValidTags.find(item => item.TagId === originalTagId) || deleteTagList.find(item => item.TagId === originalTagId)
        if (originalTag) {
          const { TagId, ProjectId } = originalTag
          tagToBeCopied.push({TagId, TagName: TagName.substring(8), newProjectId: ProjectId, OldTagId: key})  
        }
      }

      if (!!tagToBeCopied.length) {
        showSuccessNotification(injectIntlTranslation(intl, "MultiTagDuplicateTagProgress"), false, true);
        const copiedTagdata = await Promise.all(tagToBeCopied.map((item, index) => copyTagMethod(item, index)))
        showSuccessNotification(injectIntlTranslation(intl, "MultiTagDuplicateTagSuccessful"));
        const { data: { Tags } } = await getTagListData(getProjectIdFromUrl())
        updatedTagList = filteredValidTags.map(tag => {
          const index = tagToBeCopied.findIndex(tagItem => tagItem.OldTagId === tag.TagId)
          if (index >= 0) {
            const { tagId, tagConfigurationId, duplicateError = false } = copiedTagdata[index].data;
            if (!duplicateError) {
              const newTag = Tags.find(item => item.TagId === tagId)
              const cloneNewTag = cloneDeep(newTag);
              const updatedTag = {...tag, ...cloneNewTag, TagQty: tag.TagQty}
              updatedTag.UIBuilderDetails.TagConfigurationId = tagConfigurationId;
              qtyTagstoBeUpdated.forEach((item, index, array) => {
                if (item === tag.TagId) {
                  array[index] = updatedTag.TagId
                }
              });
              for (const key in updatedToBeValidatedTags) {
                if (key === tag.TagId) {
                  updatedToBeValidatedTags[updatedTag.TagId] = updatedTag
                  delete updatedToBeValidatedTags[key]
                }
              }
              return updatedTag;
            }
            else {
              tag.validRuleStatus = { ...tag.validRuleStatus, duplicateError: true }
            }
          }
          return tag;
        });
        setToBeValidatedTags(updatedToBeValidatedTags)
        setFilteredValidTags([...updatedTagList]);
        setToBeUpdatedQtyTags(qtyTagstoBeUpdated);
        setDuplicatedTagList({})
      }
    }
    catch(error) {
      const genericError = injectIntlTranslation(intl, "MultiTagDuplicateTagFailure");
      showErrorNotification(genericError);
    }
    finally {
      return {
        updatedFilteredValidTags: updatedTagList,
        updatedToBeValidatedTags
      }
    }
  }

  const getOriginalTagId = (key) => {
    const value = duplicatedTagList[key];
    const newKey = duplicatedTagList[value]
    if (newKey) {
      return getOriginalTagId(value)
    } else {
      return duplicatedTagList[key]
    }
  }

  const saveMultiTagList = async () => {
    showLoader()
    const updatedTags = await updateDataforDuplicatedTags();
    saveMultipleTag(updatedTags);
 }

  const saveMultipleTag = async ({updatedFilteredValidTags, updatedToBeValidatedTags}) => {
    if (deleteTagList && !!deleteTagList.length) {
      await updateMultipleLockState(deleteTagList)
      await deleteMultipleTag({ selectedTagData: deleteTagList, intl, callback: deleteSelectionStatus, doNotRefreshTags: true });
    }

    //validation done on filtered tags
    await validateAction({updatedFilteredValidTags, updatedToBeValidatedTags})
    //calculation on filtered tags
    await runCalculation(updatedFilteredValidTags)
    //save on filtered tags
    let validFilteredTags = [...updatedFilteredValidTags]
    await updateMultipleLockState(validFilteredTags)
    await saveTags(validFilteredTags)
    setFilteredValidTags(validFilteredTags)
    setReRenderGrid(false)
    setCloseMultiTag(false)
    hideLoader()
    if(openDialog){
      setOpenDialog(false);
      backToSelectionSummary();
    }
    setReRenderGrid(true)
  }

  const setTranslationsStrings = async (tags) => {
    let translations = {};
    for (let tag of tags) {
      const { UIBuilderDetails: { GridActions: { IsMultiTagEdit } } } = tag;
      const { workflow } = getWorkflowDetails({ workflowsConfig, workflowId: tag.ProductBuilder }) || {}
      const { translationProjectId = null } = workflow
      if (IsMultiTagEdit) {
        if (IsMultiTagEdit["isValid"]) {
          if (translationProjectId && !translations.hasOwnProperty(tag.ProductBuilder)) {
            const { data } = await ApiService(`${translationApi}getAllFromLanguageID/${translationProjectId}/${locale.lang}`, 'GET')
            if (data && data.status === 'success' && data.result) {
              translations[tag.ProductBuilder] = { ...data.result, ...locale.message }
            }
          }
        }
      }
    }
    setTranslationsData(translations)
  }

  const saveTags = async (validFilteredTags) => {
    const { UIBuilderDetails, GridActions, IsMultiTagEdit } = tagDataKeys;
    showSuccessNotification(injectIntlTranslation(intl, "MultiTagSaveProgress"), false, true)
    try {
      await Promise.all(validFilteredTags.map((tag, index) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { validation, calculation, error, save, calcError, duplicateError } = tag.validRuleStatus
            if (!save && !duplicateError) {
              const { configuration: { saveHandler = null, saveAllowedOnError = false } = null, enable = false, isValid = false } = tag[UIBuilderDetails][GridActions][IsMultiTagEdit]
              if (saveAllowedOnError || (validation && calculation && !error && !calcError)) {
                const TagConfigurationId = tag[UIBuilderDetails].TagConfigurationId || ""
                if (saveHandler && typeof saveHandler === "function") {
                  const configData = tag[UIBuilderDetails]?.ConfigurationRulesData?.VariableDomains || {}
                  const ConfigurationInputXml = tag[UIBuilderDetails]?.ConfigurationInputXml || {}
                  if (enable && isValid) {
                    const { workflow } = getWorkflowDetails({ workflowsConfig, workflowId: tag.ProductBuilder }) || {}
                    const { status, error } = await saveHandler({
                      intl,
                      tagConfigurationData: {
                        TagConfigurationId
                      },
                      tagData: tag,
                      workflowDetails: workflow,
                      configRulesData: ConfigurationInputXml,
                      projectData,
                      configurationData: configData,
                      eCatApimAppService
                    })
                    if (error) {
                      tag.validRuleStatus = { ...tag.validRuleStatus, save: false };
                    } else {
                      const { data } = status;
                      if (data && !!data.length) {
                        const { statusCode } = data[0];
                        if (statusCode === 200) {
                          tag.validRuleStatus = { ...tag.validRuleStatus, save: true }
                        } else {
                          tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
                        }
                      } else {
                        tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
                      }
                    }
                  }
                  else {
                    tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
                  }
                }
                else {
                  tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
                }
              }
              else {
                tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
              }
            }
            resolve();
          }
          catch (error) {
            tag.validRuleStatus = { ...tag.validRuleStatus, save: false }
            reject(error)
          }
        })
      })
      )
      showSuccessNotification(injectIntlTranslation(intl, "MultiTagSaveSuccessful"))
    }
    catch(error) {
      showErrorNotification(injectIntlTranslation(intl, "MultiTagSaveError"))
    }
    await updateMultipleLockState(validFilteredTags, true)
    setCopyData(null)
  }

  const deleteSelectionStatus = (status) => {
    if (status) {
      let isDeleteRowSavedInCopy = true
      selectedRowsData.forEach(row => {
        if (Array.isArray(copyData)) {
          if (!!copyData.length && row[gridUniqueKey] === copyData[0][gridUniqueKey]) {
            isDeleteRowSavedInCopy = false
          }
        }
        else {
          if (copyData && Object.values(copyData)[0].rowData[gridUniqueKey] === row[gridUniqueKey]) {
            isDeleteRowSavedInCopy = false
          }
        }
      })
      updateGridActions({ selectedColumns: {}, selectedRows: [] })
      !isDeleteRowSavedInCopy && setCopyData(null);
      setOpenDialog(false);
      setDeleteTagList([]);
    }
  }

  const copyAction = () => {
    if (!!selectedRowsData.length) {
      setCopyData(cloneDeep(selectedRowsData))
    }
    else {
      setCopyData(cloneDeep(selectedColumnsData))
    }
    setResetGrid(true);
    setCloseMultiTag(true);
    showSuccessNotification(translation("MultiTagCopySuccess"))
  }

  const pasteAction = () => {
    let newMultiTagList = [...multiTagList]
    const isRowsSelected = selectedRowsData.length >= 1
    const isCopyDataAnArray = Array.isArray(copyData)
    const copyInfo = isCopyDataAnArray ? copyData[0] : Object.values(copyData)[0]      
    newMultiTagList.forEach((row, index) => {
      if (isRowsSelected) {
        const fetchingSelectedRow = selectedRowsData.filter(rowData => row[gridUniqueKey] === rowData[gridUniqueKey])
        if (!!fetchingSelectedRow.length) {
          if (isCopyDataAnArray) {
            const {TagId,TagModel,TagName, ...copydata} = copyData[0];
            fetchingSelectedRow[0].TagQty = copyData[0].TagQty;
            const qtyProp = fetchQtyPropName(fetchingSelectedRow[0]) ? [multiTagEditGridColumn.Qty] : []
            let columnsList  = cloneDeep([...columnHeader, ...qtyProp])
            tagConfigurationChange(copyData[0],columnsList, fetchingSelectedRow[0])
            
            newMultiTagList[index] = { ...fetchingSelectedRow[0], ...copydata, [gridUniqueKey]: row[gridUniqueKey]}
          }
          else {
            tagConfigurationChange(Object.values(copyData)[0].rowData, Object.values(copyData)[0].columnNames, fetchingSelectedRow[0])
            newMultiTagList[index] = fetchingSelectedRow[0]
          }
          pasteActionMessage(fetchingSelectedRow[0])
        }
      }
      else {
        const selectedColumnsEntriesKeys = Object.keys(selectedColumnsData)
        const selectedColumnsIndex = selectedColumnsEntriesKeys.indexOf(row[gridUniqueKey])
        if (selectedColumnsIndex > -1) {
          Object.values(selectedColumnsData)[selectedColumnsIndex].columnNames.forEach(key => {  
            if (isCopyDataAnArray) {
              tagConfigurationChange(copyInfo, [key], newMultiTagList[index])
            }
            else{
              tagConfigurationChange(copyInfo.rowData, [key], newMultiTagList[index])
            }
          });
          pasteActionMessage(newMultiTagList[index])
        }
      }
    })
  }

  const tagConfigurationChange = (tagData, columnNames, fetchingSelectedRow) => {
    const { UIBuilderDetails } = tagDataKeys;
    let variableDomains = tagData[UIBuilderDetails].ConfigurationRulesData.VariableDomains;
    let fetchingVariableDomains = fetchingSelectedRow[UIBuilderDetails].ConfigurationRulesData.VariableDomains;
    const { UIBuilderDetails: { GridActions: { IsMultiTagEdit: { configuration: { ProductType } } } } } = tagData;
    columnNames.forEach((property) => {
      if(property === multiTagEditGridColumn.Qty){
        const propertyName = fetchQtyPropName(tagData)
        if (propertyName) {
          const propertiesChanged = {
            [propertyName]: tagData.TagQty,
          };
          fetchingSelectedRow[UIBuilderDetails].ConfigurationInputXml =
            getAssignmentsAfterChanged({
              inputData: fetchingSelectedRow[UIBuilderDetails].ConfigurationInputXml,
              propertiesChanged,
            });
          fetchingVariableDomains[propertyName].value = tagData.TagQty;
        }
        fetchingSelectedRow.TagQty = tagData.TagQty
      }
      else{
        if(columnDetailsInfo[property].hasOwnProperty(ProductType) && columnDetailsInfo[property][ProductType][tagData.TagModel]){
          let rowDataInfo = columnDetailsInfo[property][ProductType][tagData.TagModel];
          if(!getBooleanValue(rowDataInfo.readonly)){
            const propertiesChanged = {
              [rowDataInfo.rulePropName]: variableDomains[rowDataInfo.rulePropName].value,
            };
            fetchingSelectedRow[UIBuilderDetails].ConfigurationInputXml =
              getAssignmentsAfterChanged({
                inputData: fetchingSelectedRow[UIBuilderDetails].ConfigurationInputXml,
                propertiesChanged,
              });
            fetchingVariableDomains[rowDataInfo.rulePropName].value = variableDomains[rowDataInfo.rulePropName].value;
          }
        }
      }
    });
    fetchingSelectedRow[UIBuilderDetails].ConfigurationRulesData.VariableDomains = fetchingVariableDomains;
  };

  const pasteActionMessage = async(fetchingSelectedRow) => {
    if (isAutoValidate) {
      setRulesLoading(true)
      await updateConfigurationRulesData([fetchingSelectedRow], [], fetchingSelectedRow.TagModel, false)
      updateValidTags({[fetchingSelectedRow.TagId]: fetchingSelectedRow})
      setRulesLoading(false)
    }
    else {
      setValidatedTagList(fetchingSelectedRow)
    }
    setCloseMultiTag(true);
    setResetGrid(true)
    showSuccessNotification(translation("MultiTagPasteSuccess"))
  }

  const setValidatedTagList = (tagData) => {
    tagData.validRuleStatus = { ...tagData.validRuleStatus, validation: false, calculation: false, save: false }
    setToBeValidatedTags((prevState) => ({
      ...prevState,
      [tagData.TagId]: tagData,
    }));
  }

  const openAction = (rowData = null) => {
    tagEdit(selectedRowsData[0] || rowData, false, null, history, false, true);
  }

  const backToSelectionSummary = () => {
    unlockTagOnUnmount.current = true;
    const {ProjectID, ProjectName} = projectData;
    const url = getFullUrl(
      location,
      { url: `/${breadcrumbText.projectDetail}` },
      { ProjectId: ProjectID, ProjectName: ProjectName }
    );
    history.push(url, { ...projectData});
  }

  const validateAction = async ({updatedFilteredValidTags, updatedToBeValidatedTags}={}) => {
    const inputTagListForValidate = updatedToBeValidatedTags || toBeValidatedTags;
    try {
      if (invalidColumnDialog) {
        await updateConfigurationRulesData([invalidTagData[0]], [], null, false);
        updateValidTags({ [invalidTagData[0].TagId]: invalidTagData[0] });
        setInvalidTagData([]);
        setInvalidColumnDialog(false);
      } else {
        let toBeValidatedTagsList = Object.values(inputTagListForValidate);
        if (!!toBeValidatedTagsList.length) {
          setRulesLoading(true);
          showSuccessNotification(injectIntlTranslation(intl, "MultiTagValidateProgress"), false, true)
          await updateConfigurationRulesData(toBeValidatedTagsList.filter(tag => !(invalidatedTags.indexOf(tag.TagId) > -1)), [], null, false);
          showSuccessNotification(injectIntlTranslation(intl, "MultiTagValidateSuccessful"))
          const updatedFilteredTag = updateValidTags(inputTagListForValidate, updatedFilteredValidTags);
          setRulesLoading(false);
          setToBeValidatedTags({});
          return updatedFilteredTag;
        }
      }
    }
    catch (error) {
      showSuccessNotification(injectIntlTranslation(intl, "MultiTagValidateError"))
      setRulesLoading(false)
    }
  }


  const onTagRuleChangeAssignment = (propertiesChanged, tagData) => {
    const { UIBuilderDetails } = tagDataKeys;
    let variableDomains = tagData[UIBuilderDetails].ConfigurationRulesData.VariableDomains
    tagData[UIBuilderDetails].ConfigurationInputXml = getAssignmentsAfterChanged({ inputData: tagData[UIBuilderDetails].ConfigurationInputXml, propertiesChanged })
    for (const property in propertiesChanged) {
      const split = property.split('.')
      const propertyName = split[0]
      if (split.length > 1 && split[1] === RULES_SUBPROPS.DISPLAYUNIT) {
        if (variableDomains[propertyName]) {
          variableDomains[propertyName].displayUnit = propertiesChanged[property]
        }
      }
      else if (split.length === 1) {
        variableDomains[propertyName].value = propertiesChanged[property]
      }
      tagData[UIBuilderDetails].ConfigurationRulesData.VariableDomains = variableDomains
    }
    return tagData
  }
  const onInvalidDialogTagRuleChangeAssignment = (propertiesChanged) => {
      return onTagRuleChangeAssignment(propertiesChanged,invalidTagData[0]);
  }

  const onNewAssignmentChange = async (propertiesChanged, ruleset, tags, tagData, productType) => {
    try {
      onTagRuleChangeAssignment(propertiesChanged,tagData);
      if (isAutoValidate) {
        setRulesLoading(true)
        showSuccessNotification(injectIntlTranslation(intl, "MultiTagValidateProgress"), false, true)
        await updateConfigurationRulesData([tagData], propertiesChanged, tagData.TagModel, false)
        showSuccessNotification(injectIntlTranslation(intl, "MultiTagValidateSuccessful"))
        updateValidTags({[tagData.TagId]: tagData})
        setRulesLoading(false)
      }
      else {
        tagData.validRuleStatus = { ...tagData.validRuleStatus, validation: false, calculation: false, save: false }
        let toBeValidatedTagsList = {...toBeValidatedTags}
        toBeValidatedTagsList[tagData.TagId] = tagData
        setToBeValidatedTags(toBeValidatedTagsList)
      }
      setCloseMultiTag(true)
    }
    catch (error) {
      setRulesLoading(false)
      showErrorNotification(translation("GenericErrorMessage"))
    }
  }

  const updateValidTags = (validTags = {}, filteredValidTagsList = filteredValidTags) => {
    const validFilteredTags = filteredValidTagsList.map(tag => {
      if(validTags[tag.TagId]) {
        tagStatus(validTags[tag.TagId], true, false, false);
        return validTags[tag.TagId]
      }
      else {
        return tag
      }
    })
    setFilteredValidTags(validFilteredTags)
    return validFilteredTags;
  }

  const getExtractedDataFromRules = (ruleJson, lookUpKey) => {
    const { relaxed, valid, displayUnit} = extractDataFromRules(ruleJson, lookUpKey, intl, null);
    return {relaxed, valid, displayUnit }
  };

  const tagStatus = (tag, validation=false, calculation=false, save=false, calcError=false, duplicateError=false) => {
    const RelaxedVarNames = tag?.UIBuilderDetails?.ConfigurationRulesData?.RelaxedVarNames || []
    const Status = tag?.UIBuilderDetails?.ConfigurationRulesData?.Status || ""
    const ruleJson = tag?.UIBuilderDetails?.ConfigurationRulesData?.VariableDomains || {};
    const { UIBuilderDetails: { GridActions: { IsMultiTagEdit : {configuration: { ProductType, models }} }} } = tag;
    let ruleValidity = "true";
    let invalidDialogData = {};
    models.filter((modelData) => {
      if (modelData.model.includes(tag.TagModel)) {
        ruleValidity = getExtractedDataFromRules(ruleJson, modelData.rulesValidityPropName).value
      }
    });
    invalidDialogData = getInvalidcolumnDialogData(ruleJson,ProductType, tag)
    const isNonRuleComponentsValid = (invalidatedTags.indexOf(tag.TagId) > -1) ? false : true
    validation = validation && isNonRuleComponentsValid
    if(Status === "Feasible" && !RelaxedVarNames.length || getBooleanValue(ruleValidity) ){
      if(!!Object.keys(invalidDialogData).length){
        tag.validRuleStatus= { error : true, validation : validation, calculation : calculation, save: save, calcError: calcError, duplicateError: duplicateError}
      }
      else{
        tag.validRuleStatus= { error : false, validation : validation, calculation : calculation, save: save, calcError: calcError, duplicateError: duplicateError}
      }
    }
    else{
      tag.validRuleStatus= { error : true, validation : false, calculation : calculation, save: save, calcError: calcError, duplicateError: duplicateError}
    }
    return tag;
  }

  const getInvalidcolumnDialogData = (ruleJson, ProductType, tag) => {
    let invalidDialogData= {};
    columnHeader.forEach(column => {
      if(columnDetailsInfo[column].hasOwnProperty(ProductType) && columnDetailsInfo[column][ProductType][tag.TagModel]){
        const { relaxed, valid, displayUnit } = getExtractedDataFromRules(ruleJson, columnDetailsInfo[column][ProductType][tag.TagModel]['rulePropName'])
        let rowDataInfo = columnDetailsInfo[column][ProductType][tag.TagModel];
        let newRowDataInfo = { ruleJson: ruleJson, relaxed: relaxed, valid: valid, rulesLoading: false, displayUnit: displayUnit};
        if(relaxed || !valid){
          if(invalidDialogData[tag.TagId]) {
            invalidDialogData[tag.TagId].push({...rowDataInfo, ...newRowDataInfo})
          } else {
            invalidDialogData[tag.TagId] = [{...rowDataInfo, ...newRowDataInfo}]
          }
        }
      }
    });
    return invalidDialogData;
  }

  const duplicateAction = async() => {
    //Creating new tag id and updating data
    const newTagId = guid();
    const newTag = cloneDeep({...selectedRowsData[0], TagId: newTagId, LastModifiedDate: new Date().toISOString()})
    
    //Showing correct TagName
    let newTagName = `Copy of ${newTag.TagName}`;

    const allTags = [...filteredValidTags, ...multiInvalidTagList];

    if (allTags.find(tag => tag.TagName === newTagName)) {
      let count = 1;
      while (allTags.find(tag => tag.TagName === `${newTagName} (${count})`)) {
        count = count + 1;
      }
      newTagName = `${newTagName} (${count})`
    }

    newTag.TagName = newTagName;

    //Updating correct validation status for save
    newTag.validRuleStatus = { ...newTag.validRuleStatus, save: false }
    if (!newTag.validRuleStatus.validation) {
      setValidatedTagList(newTag)
    }

    //Updating data in duplicated list which is not yet saved
    setDuplicatedTagList({ ...duplicatedTagList, [newTagId]: selectedRowsData[0].TagId })

    //Adding tag into the list for 
    const isQuantityChanged = toBeUpdatedQtyTags.find(item => selectedRowsData[0].TagId === item);
    if (isQuantityChanged) {
      checkTagQuantityHandler(newTag, newTag.TagQty)
    }

    // Updating FilterdValidTagList data to render in grid
    const updatedTagList = [newTag, ...filteredValidTags];
    setFilteredValidTags(updatedTagList);
    setCloseMultiTag(true)
  };

  const calculateAction = async () => {
    showLoader()
    await runCalculation(filteredValidTags)
    const validFilteredTags = [...filteredValidTags]
    setFilteredValidTags(validFilteredTags)
    setCloseMultiTag(true)
    hideLoader()
  }

  const runCalculation = async (tags) => {
    const { UIBuilderDetails, GridActions, IsMultiTagEdit } = tagDataKeys;
    showSuccessNotification(injectIntlTranslation(intl, "MultiTagCalculateProgress"), false, true)
    try {
      await Promise.all(tags.map(async tag => {
        try {
          const { validation, error, calculation } = tag.validRuleStatus
          if (!calculation) {
            let calErrorStatus = true
            if (validation && !error) {
              let calStatus = false
              const { configuration: { calculationHandler = null, models = [] } = null, enable = false, isValid = false } = tag[UIBuilderDetails][GridActions][IsMultiTagEdit]
              if (calculationHandler && typeof calculationHandler === "function") {
                const configData = tag[UIBuilderDetails]?.ConfigurationRulesData?.VariableDomains || {}
                const ConfigurationInputXml = tag[UIBuilderDetails]?.ConfigurationInputXml || {}
                if (enable && isValid && models && !!models.length) {
                  let selectedModelConfig = false;
                  for (const item of models) {
                    if (item.model.includes(tag.TagModel)) {
                      selectedModelConfig = item
                    }
                  }
                  const { ProductLine = '' } = selectedModelConfig
                  const { workflow } = getWorkflowDetails({ workflowsConfig, workflowId: tag.ProductBuilder }) || {}
                  const { error = '', response = null } = await calculationHandler(
                    intl,
                    configData,
                    rulesApi,
                    calcApi,
                    { ...workflow, "PRODUCT_LINE": ProductLine },
                    ConfigurationInputXml
                  )
                  if (response) {
                    const output = response?.Tag?.runResult?.outputList?.outputData;
                    const error = output.options.outputElement.find(obj => obj["@ddname"] === "sErrorMsg") ?? null
                    calStatus = true
                    calErrorStatus = false
                    if (error) {
                      calStatus = false
                      calErrorStatus = true
                    }
                  }
                  else if (error) {
                    calStatus = false
                  }
                }
              }
              tag.validRuleStatus = { ...tag.validRuleStatus, calculation: calStatus, calcError: calErrorStatus }
            }
            else {
              tag.validRuleStatus = { ...tag.validRuleStatus, calculation: false, calcError: calErrorStatus }
            }
          }
        }
        catch (error) {
          tag.validRuleStatus = { ...tag.validRuleStatus, calculation: false, calcError: true }
        }
      }))
      showSuccessNotification(injectIntlTranslation(intl, "MultiTagCalculateSuccessful"))
    }
    catch(error) {
      showErrorNotification(injectIntlTranslation(intl, "MultiTagCalculateError"))
    }
  }

  const fetchQtyPropName = (rowData) => {
    try {
      const { TagModel, ProductBuilder: Builder } = rowData || {};
      const { childrenWorkflow, workflow } =  getChildWorkFlowDetails({ workflowId: Builder }, TagModel, builderList);
      const { tagQuantityHandler = {} } = childrenWorkflow;
      const { tagQuantityHandler: workflowTagUpdateHandler = {} } = workflow;
      if (tagQuantityHandler || workflowTagUpdateHandler) {
        const updateConfiguration = tagQuantityHandler.updateConfiguration || workflowTagUpdateHandler.updateConfiguration || {}
        const propertyName = updateConfiguration.propertyName || {}
        return propertyName
      }
      return null
    }
    catch (error) {
      return null
    }    
  }

  const checkTagQuantityHandler = (rowData, editedValue) => {
    const propertyName = fetchQtyPropName(rowData)
    if(propertyName){
      onNewAssignmentChange({[propertyName] : editedValue}, "", null, rowData, null);
    }
    rowData.TagQty = editedValue;
    setToBeUpdatedQtyTags([...toBeUpdatedQtyTags, rowData.TagId])
  }

  const provider = {
    resetGrid,
    setResetGrid,
    backToSelectionSummary,
    gridActions,
    updateGridActions,
    selectedColumnsData,
    selectedRowsData,
    copyAction,
    pasteAction,
    deleteAction,
    openAction,
    setOpenDialog,
    setInvalidColumnDialog,
    copyData,
    multiTagList,
    multiInvalidTagList,
    gridUniqueKey,
    setGridUniqueKey,
    setFilteredProducts,
    tagsFilter,
    columnHeader,
    saveMultiTagList,
    deleteTagList,
    validateAction,
    setIsAutoValidate,
    columnDetailsInfo,
    onNewAssignmentChange,
    rulesLoading,
    duplicateAction,
    invalidTagData,
    setInvalidTagData,
    calculateAction,
    getInvalidcolumnDialogData,
    onInvalidDialogTagRuleChangeAssignment,
    isAutoValidate,
    checkTagQuantityHandler,
    setCloseMultiTag,
    closeMultiTag,
    unlockTags,
    translationsData,
    invalidatedTags,
    setInvalidatedTags
  }

  return (
    <MultiTagContext.Provider value={provider}>
      <MultiTagHeader />
      <div className={paddingFromTopForFixedPosition}>
        <MultiTagFilters />
        {reRenderGrid && <MultiTagGrid />}
        <MultiTagConfirmDialog openDialog={openDialog} />
        <ShowInvalidColumnDialog invalidColumnDialog={invalidColumnDialog} />
      </div>
    </MultiTagContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  locale: state.locale,
  translationApi: state.api.translationApi,
  tagList: state.tagList.tags,
  projectData: state.createNewProject.projectData,
  rulesApi: state.api.rulesEngineApi,
  eCatApimAppService: state.api.eCatApimAppService,
  needRefresh: state.tagList.needRefresh,
  calcApi: state.api.calcEngine,
  builderList: state.getAllProductsReducer.builderList
});

export default injectIntl(withRouter(connect(mapStateToProps, { updateTagQuantity, getTagList,
  refreshProjectList, getProjectDetails, showSuccessNotification, showErrorNotification, deleteMultipleTag,
  showLoader, hideLoader, tagEdit, updateMultipleLockState, refreshTagGrid })(MultiTagEditInfo)));
