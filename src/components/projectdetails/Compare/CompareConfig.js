import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { translation } from '@carrier/ngecat-reactcomponents';

export const CompareConfig = {
  dropDownDetails: {
    name:translation("CompareReportText"),
    id:"CompareSelectionReport",
    handleType:"CompareSelectionReport",
    icon: faExchangeAlt,
    toggleDialogue: null,
    additionalCheck:"isCompareSupported"
  },
  modalDetails: {	
    open: false,
    title: translation("CompareReportText"),
    actionButtonList: [{id:"CompareAction", name: translation("CompareSelectionReport"), icon: faExchangeAlt, disabled: false, onClick: null}],
    onClose: null,
    selectedId: "",
    builder: "",
    selectedTags: [],
    selectedReportOptions: [],
    reportComponent: null,
    reportClickHandler: null
  },
  tabdetails: {
    selectedTab: 0,
    tabs: [
      {tabName: translation("TagCandidateText")},
      {tabName: translation("Reports")}
    ]
  },
  gridDetails: {
    rowData: [],
    headerData: [
      {name: "Selection Name", displayName: translation("SelectionName") },
      {name: "Model", displayName: translation("Model"), disableSorting: true}
    ],
    orderByfield: 'Selection Name',
    uniqueKey: 'Selection Name',
    showCheckbox: true,
    selectedRecordsHandler: null,
    config: [],
    singleSelectGrid: false
  },
  showDialogLoading: true,
  isDataMounted: false
};

export const init = () => {
  return CompareConfig;
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'intializeCompareDropdown':
      return {
        ...state,
        dropDownDetails: action.dropDownDetails,
        isDataMounted: true
      };
    case 'intialize':
      return {
        ...state,
        gridDetails: action.gridDetails,
        modalDetails: action.modalDetails
      };
    case 'updateDropdownDetails':
      return {
        ...state,
        dropDownDetails: action.dropDownDetails,
      };
    case 'updateModal':
      return {
        ...state,
        modalDetails: action.modalDetails
      };
    case 'showDialogue':
      return {
        ...state,
        modalDetails: action.modalDetails,
        showDialogLoading: action.showDialogLoading
      };
    case 'handleTabChange':
      return {
        ...state,
        tabdetails: action.tabdetails
      };
    case 'updateSelectedReportOptions':
      return {
        ...state,
        selectedReportOptions: action.selectedReportOptions,
        modalDetails: action.modalDetails
      };
    case 'updateGridData':
      return {
        ...state,
        gridDetails: action.gridDetails,
        modalDetails: action.modalDetails,
        showDialogLoading: false
      };
    case 'reset':
      return init();
    default:
      throw new Error();
  }
}

export default CompareConfig;