import React, { memo, useContext, useState, useEffect } from "react";
import { Grid, ThemeProvider } from '@material-ui/core'
import { ConfirmModal, Discrete, Select, Input, RangeWithUnit, InputRange, theme, Boolean, Checkbox } from "@carrier/ngecat-reactcomponents";
import { injectIntlTranslation, multiTagEditGridColumnType } from "@carrier/workflowui-globalfunctions";
import { injectIntl } from "react-intl";
import multiTagEditStyles from "../multiTagEditStyles";
import ErrorIcon from "@material-ui/icons/Error";
import { MultiTagContext } from "../multiTagContext";
import { IntlProvider } from 'react-intl'
import { connect } from "react-redux";

const ShowInvalidColumnDialog = (props) => {
  const { setInvalidColumnDialog, setInvalidTagData, openAction, invalidTagData, validateAction, onInvalidDialogTagRuleChangeAssignment, getInvalidcolumnDialogData, translationsData } = useContext(MultiTagContext);
  const { invalidColumnDialog = false, headerIcon = ErrorIcon, lang, messages } = props;
  const { confirmContainer, inValidColumnContent, inValidColumnFooter, headerIconClassName, contentInfo, gridCol, 
    inputTextDialog, selectTextDialog, unitMenu, checkBoxContainer, checkBoxStyle } = multiTagEditStyles();
  const [disableSave, setDisableSave] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(()=>{
    if(!!columns.length){
      invalidDialogColumn(columns[0])
    }
  },[columns])
  
  const onSaveClick = () => {
    validateAction();
  };

  const onActionClick = () => {
    openAction(invalidTagData[0])
  };

  const onCloseClick = () => {
    setInvalidTagData([]);
    setDisableSave(true)
    setInvalidColumnDialog(false);
  };

  const createActionsButton = () => {
    return [
      {
        id: "open_tag",
        name: injectIntlTranslation(props.intl, "OpenTag"),
        onClick: onActionClick,
        variant: "outlined",
        color: "#000000",
      },
      {
        id: "Yes_Savetag",
        name: injectIntlTranslation(props.intl, "MultiTagOK"),
        onClick: onSaveClick,
        disabled: disableSave,
      },
    ];
  };

  const createControlType = ( controlType, lookUpKey, ruleset, tags, ruleJson, rulesLoading, onChangeHandler,columnName ) => {
    switch (controlType) {
      case multiTagEditGridColumnType.TextBox:
        return (
          <Discrete
            name={lookUpKey}
            ruleset={ruleset}
            tags={tags}
            rulesJson={ruleJson}
            rulesLoading={rulesLoading}
            onNewAssignment={onChangeHandler}
          >
            <Input className={inputTextDialog}/>
          </Discrete>
        );
      case multiTagEditGridColumnType.DropDown:
        return (
          <Discrete
            name={lookUpKey}
            ruleset={ruleset}
            tags={tags}
            rulesJson={ruleJson}
            rulesLoading={rulesLoading}
            onNewAssignment={onChangeHandler}
          >
            <Select className={selectTextDialog}/>
          </Discrete>
        );
      case multiTagEditGridColumnType.UnitRange:
        return (
          <RangeWithUnit
            name={lookUpKey}
            tags={tags}
            ruleset={ruleset}
            rulesJson={ruleJson}
            rulesLoading={rulesLoading}
            onNewAssignment={onChangeHandler}
          >
            <InputRange
              unitMenu={unitMenu}
            />
          </RangeWithUnit>
        );
      case multiTagEditGridColumnType.Boolean:
        return (
          <Boolean
            name={lookUpKey}
            ruleset={ruleset}
            rulesJson={ruleJson}
            rulesLoading={rulesLoading}
            onNewAssignment={onChangeHandler}
          >
            <Checkbox
              className={checkBoxContainer}
              checkboxClassName={checkBoxStyle}
            />
          </Boolean>
        );
      default:
        return <></>;
    }
  };

  const onChangeHandler = (propertiesChanged) => {
    setColumns([onInvalidDialogTagRuleChangeAssignment(propertiesChanged)])
    setDisableSave(false)
  };

  const invalidDialogColumn = (data) => {
    const ruleJson = data?.UIBuilderDetails?.ConfigurationRulesData?.VariableDomains || {};
    const { UIBuilderDetails: { GridActions: { IsMultiTagEdit : {configuration: { ProductType }} }} } = data;     
    let invalidColumnDialogData =  getInvalidcolumnDialogData(ruleJson,ProductType, data)
    let result
    if(Object.values(invalidColumnDialogData).length){
      result = Object.values(invalidColumnDialogData)[0].map((col) => {
        return (
          <ThemeProvider theme={theme}>
            <Grid xs ={12} className={gridCol}>
            {
              createControlType( col.controlType, col.rulePropName, col.ruleset, col.tags, col.ruleJson, col.rulesLoading, onChangeHandler, col.columnName)
            }
            </Grid>
          </ThemeProvider>
        );
      })
    }
    if (result) {
      return (
        <>
          <p className={contentInfo}><span>{invalidTagData[0].TagName}</span> {injectIntlTranslation(props.intl, "InvalidContentTitle")}</p>
          {result}
        </>
      )
    }
    return (
      <>
        <p className={contentInfo}>{injectIntlTranslation(props.intl, "InvalidContentOpenTagTitle").replace('{_TAGNAME_}', invalidTagData[0].TagName)}</p>
      </>
    )
  }

  return (
    !!invalidColumnDialog && (
      <ConfirmModal
        isModalOpen={invalidColumnDialog}
        title={injectIntlTranslation(props.intl, "InvalidProperties")}
        onClose={onCloseClick}
        disableCloseIcon
        headerIcon={headerIcon}
        actionButtonList={createActionsButton()}
        contentClassName={inValidColumnContent}
        footerClassName={inValidColumnFooter}
        headerIconClassName={headerIconClassName}
      >
        <IntlProvider messages={{...translationsData[(invalidTagData[0] ? invalidTagData[0].ProductBuilder : "")], ... messages}} locale={lang}>
          <div className={confirmContainer}>
            {
              !!invalidTagData.length &&
              <>
                
                {invalidDialogColumn(invalidTagData[0])}
              </>
            }
          </div>
        </IntlProvider>
      </ConfirmModal>
    )
  );
};

const mapStateToProps = (state) => ({
  lang: state.locale.lang,
  messages: state.locale.messages,
});

export default memo(injectIntl(connect(mapStateToProps, null)(ShowInvalidColumnDialog)));
