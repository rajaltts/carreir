import { columnType, multiTagEditGridColumn, tagDataKeys } from '@carrier/workflowui-globalfunctions';
import MultiTagActionsList from './multiTagActions/multiTagActionsList';

const getLookUpKey = (key) => {
    return `${key}`
}
export const multiTagGridConfig = {
    [multiTagEditGridColumn.Actions]: {
        lookUpKey: multiTagEditGridColumn.Actions,
        columnType: columnType.customComponent,
        component: MultiTagActionsList,
        isCellHighlightEnabled: false
    },
    [multiTagEditGridColumn.SelectionName]: {
        lookUpKey: getLookUpKey(multiTagEditGridColumn.SelectionName),
        columnType: columnType.textBox,
        isEditable: false,
        onDoubleClick: null,
        validations: {},
        isCellHighlightEnabled: false
    },
    [multiTagEditGridColumn.Qty]: {
        lookUpKey: getLookUpKey(multiTagEditGridColumn.Qty),
        columnType: columnType.number,
        isEditable: true,
        onDoubleClick: null,
        validations: {},
        isCellHighlightEnabled: true
    },
    [multiTagEditGridColumn.Model]: {
        lookUpKey: `${tagDataKeys.UIBuilderDetails}-${tagDataKeys.AdditionalDetails}-${multiTagEditGridColumn.Model}:${multiTagEditGridColumn.Model}`,
        columnType: columnType.textBox,
        isEditable: false,
        onDoubleClick: null,
        validations: {},
        isCellHighlightEnabled: false
    }
}