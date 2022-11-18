import React, { useState, useRef, useEffect } from 'react';
import { Discrete, Select, Input, RangeWithUnit, InputRange, theme, Boolean, Checkbox } from '@carrier/ngecat-reactcomponents';
import { multiTagEditGridColumnType, getBooleanValue, extractDataFromRules, RULES_SUBPROPS } from '@carrier/workflowui-globalfunctions'
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Tooltip from '@material-ui/core/Tooltip'
import { injectIntl } from 'react-intl'
import { ThemeProvider } from '@material-ui/core'
import ruleBasedFormBuilderFieldStyles from "./ruleBasedFormBuilderFieldStyles"
import classNames from 'classnames'

const CreateSpanContent = ({
    value,
    valid,
    className,
    errorClassName,
    disableCell
}) => {
    return (
        <Tooltip title={value} placement="bottom-start">
            <div className={classNames(className, valid ? "" : errorClassName, disableCell)}>
                {value}
            </div>
        </Tooltip>
    )
}

const RuleBasedFormBuilderField = (props) => {
    const {
        intl,
        rowData: tagData,
        config: {
            lookUpKey: columnName,
            onChange = () => { },
            className = '',
            getColumnInfo,
        }
    } = props;
    const productType = tagData?.UIBuilderDetails?.GridActions?.IsMultiTagEdit?.configuration?.ProductType
    const {
        ruleset = "",
        rulesLoading = false,
        tags = null,
        controlType = null,
        readonly,
        rulePropName: lookUpKey = ''
    } = getColumnInfo(productType, columnName, tagData.TagModel) || {}
    const [editable, setEditable] = useState(false)
    const [editModeTd, setEditModeTd] = useState(null)
    const {
        formControlClassName, selectRootClassName, input, inputRangeRoot, container, inputNotch,
        inputOutlined, inputOutlinedRoot, error, checkBoxContainer, checkBoxStyle, spanContent, editComponent,
        disableCellContent
    } = ruleBasedFormBuilderFieldStyles()
    const ruleJson = tagData?.UIBuilderDetails?.ConfigurationRulesData?.VariableDomains || {}
    const dropdownRef = useRef(null)

    const onkeyBoardEnterClick = (event) => {
        const { id, name, target } = event.detail
        if (id === tagData.TagId && name === columnName && controlType != null) {
            onDoubleClickHandler(event)
            setEditModeTd(target)
        }
    }

    const onRemoveFocus = (event) => {
        if (dropdownRef.current && event.detail && event.detail.element.contains(dropdownRef.current)) {
            return;
        }
        setEditable(false)
    }

    useEffect(() => {
        document.addEventListener('enter', onkeyBoardEnterClick)
        document.addEventListener('removeFocus', onRemoveFocus)
        return () => {
            document.removeEventListener('enter', onkeyBoardEnterClick)
            document.removeEventListener('removeFocus', onRemoveFocus)
        }
    }, [props.rowData])
    
    useEffect(() => {
        if (editModeTd && !editable) {
            const activeElement = document.activeElement.getAttribute('data-key')
            if (editModeTd.getAttribute('data-key') === activeElement || activeElement === null) {
                editModeTd.focus()
            }
            setEditModeTd(null)
        }
    }, [editable])

    const onDoubleClickHandler = (event) => {
        event.stopPropagation()
        if (!getBooleanValue(readonly)) {
            setEditable(true)
        }
    }

    const getExtractDataFromRules = (lookUpKey)=> {
      const { value, displayUnit} = extractDataFromRules(ruleJson, lookUpKey, intl, null);
      return {value, displayUnit}
    }

    const onChangeHandler = (propertiesChanged, ruleset, tags) => {
        if (onChange) {
          for (const property in propertiesChanged) {
            const split = property.split('.')
            const propertyName = split[0]
            const {value, displayUnit} = getExtractDataFromRules(propertyName)
            if (split.length > 1 && split[1] === RULES_SUBPROPS.DISPLAYUNIT) {
                if(displayUnit !== propertiesChanged[property]){
                    onChange(propertiesChanged, ruleset, tags, tagData, productType)
                }
            }
            else{
                if(value !== propertiesChanged[property]){
                    onChange(propertiesChanged, ruleset, tags, tagData, productType)
                }
            }
          }
        }
        setEditable(false)
    }

    const clickAwayHandler = (event) => {
        if (event.target.localName === 'body') {
            return;
        }
        if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
            return;
        }
        setEditable(false)
    }

    const createComponent = () => {
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
                        <Input showLabel={false} 
                        className={input} 
                        isKeyBoardAccessible/>
                    </Discrete >
                )
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
                        <Select
                            showLabel={false}
                            formControlClassName={formControlClassName}
                            selectRootClassName={selectRootClassName}
                            isKeyBoardAccessible
                        />
                    </Discrete >
                )
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
                            isKeyBoardAccessible
                            onClick={event => event.stopPropagation()}
                        />
                    </Boolean>
                )
            case multiTagEditGridColumnType.UnitRange:
                return (
                    <RangeWithUnit
                        name={lookUpKey}
                        ruleset={ruleset}
                        rulesJson={ruleJson}
                        rulesLoading={rulesLoading}
                        onNewAssignment={onChangeHandler}
                    >
                        <InputRange
                            isLabelRequired={false}
                            inputRoot={inputRangeRoot}
                            container={container}
                            inputNotch={inputNotch}
                            inputOutlined={inputOutlined}
                            inputOutlinedRoot={inputOutlinedRoot}
                            isKeyBoardAccessible
                        />
                    </RangeWithUnit>
                )
            default:
                return <></>
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div ref={dropdownRef} onDoubleClick={onDoubleClickHandler} id="ruleBasedCompContainer">
                {
                    editable ?
                        (
                            <ClickAwayListener disableReactTree onClickAway={clickAwayHandler}>
                                <div className={editComponent}>{createComponent()}</div>
                            </ClickAwayListener>
                        )
                        :
                        (
                            <div className={spanContent}>
                                <RangeWithUnit
                                    name={lookUpKey}
                                    ruleset={ruleset}
                                    rulesJson={ruleJson}
                                    rulesLoading={rulesLoading}
                                    onNewAssignment={onChangeHandler}
                                >
                                    <CreateSpanContent
                                        disableCell={getBooleanValue(readonly) ? disableCellContent : ""}
                                        className={className}
                                        errorClassName={error}
                                    />
                                </RangeWithUnit>
                            </div>
                        )
                }
            </div>
        </ThemeProvider >
    )
}

export default injectIntl(RuleBasedFormBuilderField)