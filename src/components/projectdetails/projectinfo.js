import React from "react";
import "./projectinfo.scss";
import BuilderMenu from '../common/controls/builderList/builderMenu';
import ModalWithGrid from "./../common/controls/ModalWithGrid/ModalWithGrid";
import CustomLoader from "./../common/controls/CustomLoader/customLoader";
import { faShareSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router";
import { csoExportOpenDialouge } from "../../redux/Actions/csoExportAction";
import {
  getProjectDetailList, getAllProjectDetailList, generateSubmittalOrderFile,
} from "../../redux/Actions/getProjectdetailList";
import { upgradeTag, upgradeTagStatus } from '../../redux/Actions/projectDetailActions';
import { connect } from "react-redux";
import TagGrid from "../projectdetails/tagDetails/tagGrid/TagGrid";
import BatchUpgrade from "./tagDetails/tagGridActions/batchUpgrade/BatchUpgrade";
import CSOExport from './CSO/CSOExport';
import Compare from './Compare/Compare';
import { injectIntl } from "react-intl";
import ExportToQuotePro from "./tagDetails/tagGridActions/exportToQuotePro/ExportToQuotePro";
import { getLanguageDetails } from '../../utilities/languagesutils';
import moment from 'moment';
import {
  generatePdfReport, columnType, getUserCustomers, showSuccessNotification, showErrorNotification,
  showInfoNotification, getProjectIdFromUrl, getProjectDetails,
  tagDataKeys, refreshTagDetails, isProjectViewer,showWarningNotification,
  getFullUrl,breadcrumbText
} from '@carrier/workflowui-globalfunctions';
import { translation } from '@carrier/ngecat-reactcomponents';
import DeleteSelection from './tagDetails/tagGridActions/deleteSelection/DeleteSelection'
import GenerateOrderFile from "./tagDetails/tagGridActions/generateOrderFile/GenerateOrderFile"
import MultiTagEdit from "./tagDetails/tagGridActions/MultiTagEdit/multiTagEdit";
import GenerateReports from "./tagDetails/tagGridActions/generateReports/GenerateReports";

class Projectinfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: "",
      customerID: "",
      customerName: "",
      companyName: "",
      customerEmail: "",
      customerPhone: "",
      projectid: "",
      tagsList: [],
      isSaved: false,
      notificationDescriptionId: "",
      notificationType: '',
      skipTakeValues: {
        skip: 0,
        take: 100
      },
      visible: false,
      loading: false,
      failedTagItems: [],
      showDialogLoading: true,
      showGenerateOrderDialogue: false,
      showExportToQuotePro: false,
      showCompare: false,
      generateSubmittalReportButton: { id: 'GenerateSubmittalReport', value: translation("GenerateSubmittalReport"), icon: faShareSquare, onClick: this.onGenerateSubmittalClick },
      generateSubmittalReport: false,
      modalDetails: {},
      maxLimit: 0,
      errorMsg: '',
      dropDownDetails: {
        name: translation("GenerateOrderFile"),
        icon: faShareSquare,
        id: "generateOrder",
        handleType: "generateOrder",
        toggleDialogue: this.toggleGenerateOrderDialogue,
        additionalCheck: "isGenerateOrderSupported"
      },
      gridDetails: {
        rowData: [],
        headerData: [
          { name: "Selection Name", displayName: translation("SelectionName") },
          { name: "Model", displayName: translation("Model"), disableSorting: true }
        ],
        orderByfield: 'Selection Name',
        uniqueKey: 'Selection Name',
        showCheckbox: true,
        selectedRecordsHandler: this.selectedRecordsHandler
      },
      selectedTags: [],
      loaderText: "",
      height: window.outerHeight || 0,
      showMultiTagEdit: false 
    };
    this.toggleDialogue = this.toggleDialogue.bind(this);
  }

  componentDidMount() {
    document.title = "Project Detail - eCAT"
    this.props.refreshTagDetails();
    const projId = getProjectIdFromUrl();
    if (this.props.projectData.ProjectID !== projId || !this.props.projectData.UserRole) {
        this.props.getProjectDetails(projId, translation("GenericErrorMessage"));
    }
    this.setState({
      isSaved: false
    });
    this.updateHeightDimensions();
    window.addEventListener('resize', this.updateHeightDimensions)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang.lang !== this.props.lang.lang) {
      this.setState({
        generateSubmittalReportButton: { id: 'GenerateSubmittalReport', value: translation("GenerateSubmittalReport"), icon: faShareSquare, onClick: this.onGenerateSubmittalClick }
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeightDimensions)
  }

  updateHeightDimensions = () => {
    if (this.state.height !== window.outerHeight) {
      this.setState({ height: 0 });
      this.setState({ height: window.outerHeight });
    }
  };

  projectOptionsSuccess = (result) => {
    this.setState({
      showGenerateOrderDialogue: result.isGenerateOrderFile,
      showExportToQuotePro: result.isExportToQP,
      showCompare: result.isCompare,
      generateSubmittalReport: result.isSubmittal
    });
  }

  setSelectedTags = value => {
    this.setState({ tagsList: value });
  };

  clearSelectedTags = () => {
    this.setState({ tagsList: [], isUpgradeEnable: false });
  };

  toggleprojectDialog = () => {
    this.child.toggleprojectDialog();
  }

  toggleDialogue(flag, e) {
    this.props.csoExportOpenDialouge(flag, e);
  }

  onGenerateSubmittalClick = () => {
    this.setState({ maxLimit: 0 });
    const generateSubmittalReportText = translation("GenerateSubmittalReport");
    const modalDetails = {
      open: false,
      title: generateSubmittalReportText,
      actionButtonList: [{ id: "GenerateSubmittalReport", name: generateSubmittalReportText, icon: faShareSquare, disabled: true, onClick: this.onGenerateSubmittalReportClick }],
      onClose: this.getAllProjectDetail,
      selectedId: null,
      productBuilderId: null,
    };
    this.getAllProjectDetail(true, modalDetails, '', this.filterSubmittalRecords);
  }

  filterSubmittalRecords = (records) => {
    return records.filter((item) => item.IsSubmittal);
  }

  onGenerateSubmittalReportClick = async () => {
    this.setState({ loading: true, loaderText: "" });
    const selectedTagsList = this.state.selectedTags.map(tag => tag.Id);
    const localDate = moment().format('MM/DD/YYYY LT');
    const generateOrderFileObj = {
      "ReportList": [],
      "ProjectId": this.props.projectData.ProjectID,
      "Culture": getLanguageDetails(this.props.lang.name).fullLangCode,
      "Tags": selectedTagsList,
      "SelectedModel": this.state.selectedTags[0].SelectedModelId,
      "ProductBuilder": this.state.modalDetails.productBuilderId,
      "LocalDate": localDate
    };
    this.props.generateSubmittalOrderFile(generateOrderFileObj, this.generateSubmittalOrderSuccess, this.generateSubmittalOrderFail);
  }

  generateSubmittalOrderSuccess = (data) => {
    this.closeDialogue();
    this.props.showSuccessNotification(translation("GENERATE_SUBMITTAL_ORDER_SUCCESS"));
    generatePdfReport(data.FileData.FileContents, `${this.state.project}_Project_Report.pdf`, true, false, this.popupBlockAction);
  }

  generateSubmittalOrderFail = (error) => {
    this.closeDialogue();
    if(error.response.data["ECatCode"] === 409){
      let jsonData = JSON.parse(error.response.data["Message"])
      this.props.showWarningNotification(translation("TagLockWarningMessage","",{_TAGNAME_: jsonData["TagName"] ,_USER_: jsonData["User"] }));
    }
    else{
      this.props.showErrorNotification(translation("GENERATE_SUBMITTAL_ORDER_FAILURE"));
    }
  }

  popupBlockAction = () => {
    this.props.showInfoNotification(translation("PopUpBlockWarning"));
  }

  getAllProjectDetail = (flag, modelDetails, selectedModelId, filterRecords) => {
    const modalInfo = modelDetails || this.state.modalDetails;
    modalInfo.open = flag;
    if (flag) {
      modalInfo.actionButtonList = modalInfo.actionButtonList.map((button) => {
        button.disabled = true;
        return button;
      });
      this.setState({
        modalDetails: modalInfo,
        showDialogLoading: flag
      }, () => {
        this.props.getAllProjectDetailList(this.props.projectData.ProjectID, selectedModelId, this.props.currentRole, this.updateGridData, filterRecords);
      });
    }
    else {
      this.setState({
        selectedTags: []
      }, () => {
        this.updateGridData([]);
      });
    }
  }

  closeDialogue = () => {
    this.setState({ loading: false, loaderText: "" });
    this.getAllProjectDetail(false);
  }

  updateGridData = (result, selectedModelId = null, builderId = null) => {
    const gridInfo = this.state.gridDetails;
    const modalInfo = this.state.modalDetails;
    modalInfo.selectedId = selectedModelId;
    modalInfo.productBuilderId = builderId;

    const rowsData = result.map(item => {

      return {
        "Id": item.TagId,
        "Selection Name": item.TagName,
        "Model": item.TagModel,
        "SelectedModelId": item.SelectedModelId,
        "IsAllCalculation": item.IsAllCalculation
      }
    });
    gridInfo.rowData = rowsData;
    this.setState({ gridDetails: gridInfo, modalDetails: modalInfo, showDialogLoading: false });
  }

  selectedRecordsHandler = (selectedItems) => {
    const modalInfo = this.state.modalDetails;
    modalInfo.actionButtonList = modalInfo.actionButtonList.map((button) => {
      if (this.state.maxLimit) {
        button.disabled = !(selectedItems.length > 0 && selectedItems.length < (this.state.maxLimit + 1))
        if (selectedItems.length > this.state.maxLimit) {
          modalInfo.errorMsg = this.state.errorMsg;
          this.setState({ modalDetails: modalInfo });
        }
        else {
          modalInfo.errorMsg = ""
          this.setState({ modalDetails: modalInfo });
        }
        return button;
      }
      else {
        button.disabled = !(selectedItems.length > 0);
        return button;
      }
    });
    this.setState({
      selectedTags: selectedItems,
      modalDetails: modalInfo
    });
  }

  render() {
    return (
      <>
        {(this.state.loading) &&
          <CustomLoader showLoaderImage={true} loadertext={this.state.loaderText} visible={true} />
        }
        <div className="command-bar action-left">
          <div className="cmdbar-right">
            <ModalWithGrid
              showDialogLoading={this.state.showDialogLoading}
              dropDownDetails={this.state.dropDownDetails}
              modalDetails={this.state.modalDetails}
              gridDetails={this.state.gridDetails}
              button={this.state.generateSubmittalReportButton}
              buttonType={columnType.button}
              showComponent={this.props.tagGridAction[tagDataKeys.IsGenerateSubmittal]}
            />
            <MultiTagEdit projectData={this.props.projectData} />
            <GenerateReports />
            <Compare
              projectID={this.props.projectData.ProjectID}
            />
          </div>
        </div>

        <div className="command-bar">
          <h1>{translation("SelectionSummary")}</h1>
          <div className="cmdbar-right">
            <GenerateOrderFile />
            <ExportToQuotePro />
            <BatchUpgrade />
            <CSOExport
              projectID={getProjectIdFromUrl()}
              popupBlockAction={this.popupBlockAction}
              showCSOExport={this.props.tagGridAction[tagDataKeys.IsCsoExport]}
            />
            <BuilderMenu
              showGradient
              dropdownMenuClass="projectInfoSelectionLeftMargin"
              buttonProps={{ name: translation("AddNewSelection"), id: "AddSelection", iconProps: { icon: faPlus }, 
                            disabled: isProjectViewer(this.props.projectData.UserRole) }}
              projectDetails={{
                route: "fromTags",
                ProjectName: this.props.projectData && this.props.projectData.ProjectName,
                ProjectID: this.props.projectData.ProjectID,
                CustomerName: this.state.customerName,
                CustomerID: this.state.customerID
              }}
            />
          </div>
        </div>
        <div className="Projectdetailgrid" style={{ margin: 0 }}>
          {(this.state.height >= 1) && 
            <TagGrid
              Projectid={getProjectIdFromUrl()}
              ProjectName={this.props.projectData.ProjectName}
            />
          }
        </div>

        <DeleteSelection />
      </>
    )
  }
}

const mapStateToProps = state => ({
  tagGridAction: state.tagList.tagGridActions,
  csoExport: state.csoExport,
  lang: state.locale,
  currentRole: state.locale.role,
  projectData: state.createNewProject.projectData
});

export default injectIntl(withRouter(
  connect(
    mapStateToProps,
    {
      getUserCustomers, csoExportOpenDialouge, upgradeTag, upgradeTagStatus, getProjectDetails, refreshTagDetails,
      getProjectDetailList, getAllProjectDetailList, generateSubmittalOrderFile,
      showSuccessNotification,
      showErrorNotification,
      showInfoNotification,
      showWarningNotification
    }
  )(Projectinfo)
));
