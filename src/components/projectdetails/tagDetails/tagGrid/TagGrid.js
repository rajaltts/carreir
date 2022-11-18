import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from "react-intl";
import { CustomGrid } from '@carrier/ngecat-reactcomponents';
import { injectIntlTranslation, tagGridColumn, sortingOrder, tagActionsType, showWarningNotification } from '@carrier/workflowui-globalfunctions';
import {
    getTagList, clearTagsList, updateSelectedTagsList,
    upsertTagGridColumnSettings
} from '../../../../redux/Actions/getTagList';
import { updateTagName, updateTagQuantity, updateTagComment, tagUpdating } from '../../../../redux/Actions/updateTag'
import { tagGridConfig } from "./TagGridConfig";
import useTagGridStyles from './TagGridStyles';
import { tagEdit } from '../../../../redux/Actions/tagActions/editTagAction';
import { TAG_GRID_COLUMN_SETTING } from "../../../../utilities/constants/Constants";

const TagGrid = (props) => {
    const { getTagList, clearTagsList, isLoading, tagList, needRefresh, intl, lang, history, upsertTagGridColumnSettings, tagGridColumnSettings,
        updateTagName, updateTagQuantity, updateTagComment, updateSelectedTagsList, tagEdit, tagUpdated, tagUpdating, showWarningNotification, Projectid } = props;
    const { IsEditSelection, IsEditCopyasAlternate } = tagActionsType
    const { gridRoot, actionsStyles } = useTagGridStyles();

    const getHeaderData = () => {
        const { SelectionName, Model, CRMReference, Price, ChillerArrangement, Capacity, Quantity, Comment,
            DateModified, actions, SVP } = tagGridColumn;
        return [
            { name: SelectionName, displayName: injectIntlTranslation(intl, "SelectionName"), isSelected: isHeaderSelected(SelectionName, true), isDefaultSelection: true},
            { name: Model, displayName: injectIntlTranslation(intl, "SSModel"), isSelected: isHeaderSelected(Model, true), isDefaultSelection: true },
            { name: CRMReference, displayName: injectIntlTranslation(intl, "CRMReference"), isSelected: isHeaderSelected(CRMReference, false), isDefaultSelection: false },
            { name: Price, displayName: injectIntlTranslation(intl, "Price"), isSelected: isHeaderSelected(Price, false), isDefaultSelection: false },
            { name: ChillerArrangement, displayName: injectIntlTranslation(intl, "ChillerArrange"), isSelected: isHeaderSelected(ChillerArrangement, true), isDefaultSelection: false },
            { name: Capacity, displayName: injectIntlTranslation(intl, "Capacity"), isSelected: isHeaderSelected(Capacity, true), isDefaultSelection: false },
            { name: Quantity, displayName: injectIntlTranslation(intl, "SSQuantity"), isSelected: isHeaderSelected(Quantity, true), isDefaultSelection: true },
            { name: Comment, displayName: injectIntlTranslation(intl, "Comment"), isSelected: isHeaderSelected(Comment, false), isDefaultSelection: false },
            { name: SVP, displayName: injectIntlTranslation(intl, "SVP"), isSelected: isHeaderSelected(SVP, false), isDefaultSelection: false },
            { name: DateModified, displayName: injectIntlTranslation(intl, "SSDateModified"), isSelected: isHeaderSelected(DateModified, true), isDefaultSelection: true },
            { name: actions, displayName: injectIntlTranslation(intl, "Actions"), disableSorting: true, className: actionsStyles, isSelected: isHeaderSelected(actions, true), isDefaultSelection: true }
        ];
    }

    const isHeaderSelected = (columnName, defaultSelection) => {
        if (tagGridColumnSettings.length) {
            return (tagGridColumnSettings.indexOf(columnName) > -1);
        }
        return defaultSelection;
    }

    const saveColumnOptions = (newHeaderCells) => upsertTagGridColumnSettings(newHeaderCells, TAG_GRID_COLUMN_SETTING);

    /**
     * Please do not remove below loadGrid variable as this is needed to load grid properly when we naviagte
     * to any builder where custom grid is loading and back again on this page again
     */
    const [loadGrid, setLoadGrid] = useState(false);
    const [onload, setonload] = useState(true);
    const [headCells, setHeadCells] = useState(getHeaderData());

    useEffect(() => {
        getTagListData();
        setLoadGrid(true);
        return () => clearTagsList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        needRefresh && getTagListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needRefresh]);

    useEffect(() => {
        if (tagList.length > 0) {
            setonload(false);
        }
    }, [tagList]);

    useEffect(() => {
        setHeadCells(getHeaderData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang, tagGridColumnSettings]);

    const getTagListData = () => {
        Projectid && getTagList(Projectid);
    }

    const updateTagNameHandler = async (event, editedValue, rowData, rowIndex) => {
        tagUpdating();
        setonload(false);
        updateTagName(rowData, editedValue, rowIndex, intl);
    }
    const updateTagQuantityHandler = async (event, editedValue, rowData, rowIndex) => {
        tagUpdating();
        updateTagQuantity(rowData, editedValue, rowIndex, intl);
    }
    const updateTagCommentHandler = async (event, editedValue, rowData, rowIndex) => {
        tagUpdating();
        updateTagComment(rowData, editedValue, rowIndex, intl);
    }

    const rowCheckboxHandler = (selectedTags) => {
        updateSelectedTagsList(selectedTags)
    }

    const rowOnclickHandler = (rowdata, index, event) => {
        if (!tagUpdated) {
            const { UIBuilderDetails: { TagActions } } = rowdata;
            for (const data of TagActions) {
                if (data.action === IsEditSelection && data.enable) {
                    tagEdit(rowdata, false, data.SelectionColumn, history);
                    break;
                } else if (data.action === IsEditCopyasAlternate && data.enable) {
                    tagEdit(rowdata, true, data.SelectionColumn, history);
                    break;
                }
            }
        }
    }

    const validateTagName = (editedValue) => {
        let validateMessage = ''
        if (!editedValue || !editedValue.trim()) {
            validateMessage = "EnterSelectionName"
        }
        // eslint-disable-next-line no-useless-escape
        else if ((!editedValue.match(/^[^'\"&\/#,<>|\\\\]*$/))) {
            validateMessage = "SpecialCharactersNotAllowed"
        }
        if (validateMessage && onload) {
            showWarningNotification(injectIntlTranslation(intl, "TagNameValidationMessage"));
            setonload(false);
        }
        return validateMessage
    }

    const validateTagQty = (editedValue) => {
        let validateMessage = ''
        if (editedValue === "0") {
            validateMessage = "QuantityZero"
        }
        else if ((!editedValue || !editedValue.trim()) || !(!isNaN(editedValue) && Number.isInteger(parseFloat(editedValue)))) {
            validateMessage = "ValidationValidNumber"
        }
        else if (parseFloat(editedValue) < 0) {
            validateMessage = "NegativeQtyValue"
        }
        return validateMessage
    }

    tagGridConfig[tagGridColumn.SelectionName].onDoubleClick = updateTagNameHandler;
    tagGridConfig[tagGridColumn.SelectionName].validations = { validation: validateTagName }
    tagGridConfig[tagGridColumn.Quantity].onDoubleClick = updateTagQuantityHandler;
    tagGridConfig[tagGridColumn.Quantity].validations = { validation: validateTagQty }
    tagGridConfig[tagGridColumn.Comment].onDoubleClick = updateTagCommentHandler;
    tagGridConfig[tagGridColumn.Comment].validations = { validation: validateTagName }


    return (
        <div id="Projectdetailgrid" className="tagGridDetails">
            {loadGrid &&
                <CustomGrid
                    gridClassName={gridRoot}
                    showCheckbox={true}
                    headCells={headCells}
                    uniqueKey={'TagId'}
                    rows={tagList}
                    isLoading={isLoading && !tagList.length}
                    hideSearch
                    sortable
                    orderByfield={tagGridColumn.DateModified}
                    rowsPerPageOptions={[5, 10, 20, 100]}
                    rowsToShowPerPage={100}
                    doNotTranslate={false}
                    config={tagGridConfig}
                    rowCheckboxHandler={rowCheckboxHandler}
                    rowOnclickHandler={rowOnclickHandler}
                    sorting={sortingOrder.descending}
                    showLinearProgress={isLoading && !!tagList.length}
                    columnPicker
                    saveColumnHandler={saveColumnOptions}
                />
            }
        </div>
    );
};
const mapStateToProps = (state) => ({
    tagList: state.tagList.tags,
    isLoading: state.tagList.isLoading,
    lang: state.locale.leafLocale,
    needRefresh: state.tagList.needRefresh,
    tagUpdated: state.tagList.tagUpdating,
    tagGridColumnSettings: (state.userProfile.userColumnSettings[TAG_GRID_COLUMN_SETTING] || [])
});

export default injectIntl(withRouter(connect(mapStateToProps, {
    getTagList, clearTagsList, tagEdit, updateTagName, updateTagQuantity, updateTagComment, tagUpdating, showWarningNotification,
    updateSelectedTagsList, upsertTagGridColumnSettings
})(TagGrid)));
