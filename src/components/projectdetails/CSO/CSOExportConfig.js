import { faExternalLinkAlt, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { translation } from '@carrier/ngecat-reactcomponents';
import { columnType } from '@carrier/workflowui-globalfunctions';

export const CSOExportConfig = {
  modalDetails: {	
    open: false,
    title: translation("ChillerSystemOptimizer"),
    actionButtonList: [{id:"CSOExportAction", name: translation("ProjectDetailsCalculate"), icon: faCalculator, disabled: true, onClick: null}],
    onClose: null,
    selectedId: null,
    defaultSelectedId: "",
    selectedTags: [],
    productBuilderId: null,
    IsSAPSupported: true,
    result: [],
    csoPoints: [],
    calculationMsHandler: null,
    version: ""
  },
  dropDownDetails: {
    name:translation("CalculateCSO"),
    icon:faExternalLinkAlt,
    id:"CSOExport",
    handleType:"cso",
    toggleDialogue: null,
    additionalCheck: "isCsoExportSupported"
  },
  gridDetails: {
    rowData: [],
    headerData: [
        {name: "Tag Name", displayName: translation("TagName") },
        {name: "Part No",  displayName: translation("PartNo"), disableSorting: true}
    ],
    naHeaderData: [
        {name: "Tag Name", displayName: translation("TagName") },
        {name: "Part No",  displayName: translation("PartNo"), disableSorting: true}
    ],
    emeaHeaderData: [
        {name: "Tag Name", displayName: translation("TagName") },
        {name: "Part No", displayName: translation("PartNo"), disableSorting: true},
        {name: "CSO Inputs", displayName: translation("CSOinputs"), disableSorting: true}
    ],
    orderByfield: "Tag Name",
    uniqueKey: "Tag Name",
    showCheckbox: true,
    singleSelectGrid: null,
    selectedRecordsHandler: null,
    config: [],
    errorMsg: '',
    maxLimit: ''
  },
  showDialogLoading: true,
  isDataMounted: false,
  csoInputsDialougeVisible: false,
  tag: [],
  loading: false
};

export const csoInput = {
  "CSO Inputs": {
      name: translation("CSOinputs"),
      columnType: columnType.button,
      className: "eButton ebuttonSave",
      onClick: () => { },
  }
};

export const init = () => {
  return CSOExportConfig;
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'updateDropdownDetails':
            return {
                ...state,
                dropDownDetails: action.dropDownDetails,
            };
      case 'intialize':
            return {
                ...state,
                gridDetails: action.gridDetails,
                dropDownDetails: action.dropDownDetails,
                modalDetails: action.modalDetails,
                isDataMounted: true
            };
      case 'showDialogue':
            return {
                ...state,
                modalDetails: action.modalDetails,
                showDialogLoading: action.showDialogLoading
            };
      case 'updateGridData':
            return {
                ...state,
                gridDetails: action.gridDetails,
                modalDetails: action.modalDetails,
                showDialogLoading: false,
                tagData: action.tagData
            };
      case 'updateSelectionType':
            return {
                  ...state,
                  gridDetails: action.gridDetails
            };
      case 'updateSelectedRecord':
            return {
                ...state,
                modalDetails: action.modalDetails
            };
      case 'emptyCSOPointsAndTag':
            return {
                ...state,
                modalDetails: action.modalDetails,
                tag: []
            };
      case 'enableCSOInputAndUpdateTag':
            return {
                ...state,
                csoInputsDialougeVisible: true,
                tag: action.tag
            };
      case 'toggleCSOInput':
            return {
                ...state,
                csoInputsDialougeVisible: !state.csoInputsDialougeVisible,
            };
      case 'updateLoading':
            return {
                ...state,
                loading: action.loading,
            };
      case 'reset':
            return init();
      default:
            throw new Error();
  }
}

export default CSOExportConfig;