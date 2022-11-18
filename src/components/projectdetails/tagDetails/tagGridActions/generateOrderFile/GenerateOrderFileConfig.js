import { faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { translation } from '@carrier/ngecat-reactcomponents';

export const GenerateOrderFileConfig = {
  dropDownDetails: {
    name:translation("GenerateOrderFile"),
    id:"generateOrder",
    handleType:"generateOrder",
    icon: faShareSquare,
    toggleDialogue: null,
    additionalCheck:"isGenerateOrderSupported"
  },
  modalDetails: {	
    open: false,
    title: translation("GenerateOrderFile"),
    actionButtonList: [{id:"GenerateOrderFileAction", name: translation("GenerateOrderFile"), icon: faShareSquare, disabled: false, onClick: null}],
    onClose: null,
    selectedId: "",
    builder: "",
    selectedTags: [],
    selectedReportOptions: [],
    reportComponent: null,
    reportClickHandler: null,
    maxCountForReport: null,
    isAllCalculationRequired: false,
    errorMsg: ""
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
  return GenerateOrderFileConfig;
}

export const generateOrderConstants = {
  IntializeGenerateDropdown: "intializeGenerateDropdown",
  Intialize: "intialize",
  UpdateModal: "updateModal",
  ShowDialogue: "showDialogue",
  Reset: "reset",
  UpdateGridData: "updateGridData",
  HandleTabChange: "handleTabChange",
  UpdateDropdownDetails: "updateDropdownDetails"
}

export const reducer = (state, action) => {
  const { IntializeGenerateDropdown, Intialize, UpdateModal, ShowDialogue, Reset,
    UpdateGridData, HandleTabChange, UpdateDropdownDetails } = generateOrderConstants;
  switch (action.type) {
    case IntializeGenerateDropdown:
      return {
        ...state,
        dropDownDetails: action.dropDownDetails,
        isDataMounted: true
      };
    case Intialize:
      return {
        ...state,
        gridDetails: action.gridDetails,
        modalDetails: action.modalDetails
      };
    case UpdateDropdownDetails:
      return {
        ...state,
        dropDownDetails: action.dropDownDetails,
      };
    case UpdateModal:
      return {
        ...state,
        modalDetails: action.modalDetails
      };
    case ShowDialogue:
      return {
        ...state,
        modalDetails: action.modalDetails,
        showDialogLoading: action.showDialogLoading
      };
    case HandleTabChange:
      return {
        ...state,
        tabdetails: action.tabdetails
      };
    case UpdateGridData:
      return {
        ...state,
        gridDetails: action.gridDetails,
        modalDetails: action.modalDetails,
        showDialogLoading: false
      };
    case Reset:
      return init();
    default:
      throw new Error();
  }
}

export default GenerateOrderFileConfig;