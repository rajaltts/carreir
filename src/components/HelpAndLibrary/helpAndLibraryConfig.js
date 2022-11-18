import { columnType } from "@carrier/workflowui-globalfunctions";

export const helpLibraryConfig = {
    'HyperLink': {
        lookUpKey: "FileHyperLinkName",
        columnType: columnType.url,
        onClick: null
    },
    'Document': {
        lookUpKey: "Document",
        formatValue: null,
    },
    'Category': {
        lookUpKey: "Category",
    }
};