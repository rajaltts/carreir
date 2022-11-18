import { columnType, tagGridColumn, tagDataKeys } from '@carrier/workflowui-globalfunctions'
import TagActionsList from "./tagActions/TagActionsList";

const getLookUpKey = (key) => {
    return `${tagDataKeys.UIBuilderDetails}-${tagDataKeys.AdditionalDetails}-${key}:${key}`
}

export const tagGridConfig = {
    [tagGridColumn.SelectionName]: {
        lookUpKey: getLookUpKey(tagGridColumn.SelectionName),
        columnType: columnType.textBox,
        isEditable: true,
        onDoubleClick: null,
        validations: {},
        validationsOnLoading: true,
    },
    [tagGridColumn.Model]: {
        lookUpKey: getLookUpKey(tagGridColumn.Model),
    },
    [tagGridColumn.CRMReference]: {
        lookUpKey: getLookUpKey(tagGridColumn.CRMReference),
    },
    [tagGridColumn.Price]: {
        lookUpKey: getLookUpKey(tagGridColumn.Price),
    },
    [tagGridColumn.ChillerArrangement]: {
        lookUpKey: getLookUpKey(tagGridColumn.ChillerArrangement),
    },
    [tagGridColumn.Capacity]: {
        lookUpKey: getLookUpKey(tagGridColumn.Capacity),
        isNumericSort: true
    },
    [tagGridColumn.SVP]: {
        lookUpKey: getLookUpKey(tagGridColumn.SVP),
    },    
    [tagGridColumn.Quantity]: {
        lookUpKey: getLookUpKey(tagGridColumn.Quantity),
        columnType: columnType.number,
        isEditable: true,
        onDoubleClick: null,
        validations: {}
    },
    [tagGridColumn.Comment]: {
        lookUpKey: getLookUpKey(tagGridColumn.Comment),
        isEditable: true,
        columnType: columnType.textBox,
        onDoubleClick: null,
    },
    [tagGridColumn.DateModified]: {
        lookUpKey: getLookUpKey(tagGridColumn.DateModified),
        columnType: columnType.date,
        format: 'MM/DD/YYYY LT'
    },
    [tagGridColumn.actions]: {
        lookUpKey: `${tagDataKeys.UIBuilderDetails}-${tagDataKeys.TagActions}`,
        columnType: columnType.customComponent,
        alt: 'Actions',
        component: TagActionsList
    },
}
