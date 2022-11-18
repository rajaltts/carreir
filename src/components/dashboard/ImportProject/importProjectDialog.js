import React, { useState } from "react";
import {
  RandomNumber,
  validateFormFields,
  ApiService,
  injectIntlTranslation,
  showLoader,
  hideLoader,
  defaultValidation,
  defaultValidationMessages,
  endPoints,
  showErrorNotification,
  showSuccessNotification,
  refreshProjectList,
} from "@carrier/workflowui-globalfunctions";
import { injectIntl } from "react-intl";
import { ConfirmModal } from "@carrier/ngecat-reactcomponents";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import importProjectStyles from "./importProjectStyles";
import appConfig from "../../../Environment/environments";
import { connect } from "react-redux";
import { Date } from "core-js";
import { Alert } from "@material-ui/lab";
import axios from "axios";

const ImportProjectDialog = (props) => {
  const {
    intl,
    showErrorNotification,
    showSuccessNotification,
    refreshProjectList,
    showLoader,
    hideLoader,
    toggleprojectDialog,
  } = props;
  const [projectError, setprojectError] = useState("");
  const [fileError, setfileError] = useState("");
  const [projectValidation, setprojectValidation] = useState(false);
  const [projectName, setProjectName] = useState("Project " + RandomNumber());
  const [projectFile, setProjectFile] = useState(null);
  const [projectFileName, setprojectFileName] = useState(null);
  const [disableSave, setdisableSave] = useState(true);
  const {
    tagNameContainer,
    tagNameLabel,
    tagNameField,
    errorBorder,
    nonErrorBorder,
    requiredAsterik,
    filePosition,
    errorMsg,
    body,
    fileLable,
    fileButton,
    fileDiv,
    inputActual,
  } = importProjectStyles();
  const errorClass = projectValidation ? errorBorder : nonErrorBorder;
  const hiddenFileInput = React.useRef();

  const validateProjectField = (e) => {
    setProjectName(e.target.value);
    let projectValidation = validateFormFields(
      e.target.value,
      defaultValidation,
      defaultValidationMessages(intl)
    );
    setprojectError(projectValidation);
    if (projectValidation) {
      setprojectValidation(true);
      setdisableSave(true);
    } else {
      setprojectValidation(false);
      if (!fileError && projectFile) {
        setdisableSave(false);
      }
    }
  };

  const getProjectFileExtension = (filename) => {
    return filename.split(".").pop().toUpperCase();
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const onChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      setprojectFileName(e.target.files[0].name);
      const fileExtension = getProjectFileExtension(e.target.files[0].name);
      if (fileExtension !== "E4A" && fileExtension !== "E3A") {
        setfileError(injectIntlTranslation(intl, "ProjectImportFileFormat"));
        setdisableSave(true);
      } else {
        setProjectFile(e.target.files[0]);
        setfileError("");
        if (!projectError) {
          setdisableSave(false);
        }
      }
    } else {
      setprojectFileName(null);
      setfileError(injectIntlTranslation(intl, "ProjectFileForUploadRequired"));
      setdisableSave(true);
    }
  };

  const importProject = async () => {
    try {
      showLoader();
      setdisableSave(false);
      const formData = new FormData();
      formData.append("file", projectFile);
      const fileExtension = getProjectFileExtension(projectFile.name);
      if (fileExtension === "E4A") {
        const size = Math.round((projectFile.size / 1024));
        if (size >= 10240) {
        let todayDate  = new Date();
        let dateAppendedWithTimeStamp = todayDate.toISOString().replace(/[^0-9]/g,""); 
        let projectFileWithDate = dateAppendedWithTimeStamp+`_`+projectFile.name;
        let projectFileWithDateAppended = new File([projectFile],projectFileWithDate,{
          type:projectFile.type
        })
        let importPreSignedUrl = await ApiService(
          `${appConfig.api.eCatApimImportExportService}${endPoints.GET_PRE_SIGNED_URL}${projectFileWithDate}`,
          "GET",
        );
        const importPreSignedUrlStatus = await axios({
          method:"PUT",
          url:importPreSignedUrl.data,
          data:projectFileWithDateAppended
        }
          );
          console.log('importSuccessStatus',importPreSignedUrlStatus.status);
          hideLoader();
          let ProjectImportSuccessMessagemsg = injectIntlTranslation(
            intl,
            "ProjectImportSuccessMessage"
          ).replace("_PROJECTNAME_", '"' + projectFileWithDate + '"');
          showSuccessNotification(ProjectImportSuccessMessagemsg);
          toggleprojectDialog();
          refreshProjectList();
        } else {
          await ApiService(
            `${appConfig.api.eCatApimImportExportService}${endPoints.IMPORT_PROJECT}${projectName}`,
            "POST",
            formData
          );
          hideLoader();
          let ProjectImportSuccessMessagemsg = injectIntlTranslation(
            intl,
            "ProjectImportSuccessMessage"
          ).replace("_PROJECTNAME_", '"' + projectName + '"');
          showSuccessNotification(ProjectImportSuccessMessagemsg);
          toggleprojectDialog();
          refreshProjectList();
        }

      } else {
        console.log(projectFile);
        await ApiService(
          `${appConfig.api.eCatAppService}${endPoints.POST_PROJECT_IMPORT}${
            projectName + "&fileExtension=" + fileExtension
          }`,
          "post",
          projectFile
        );
        hideLoader();
        let ProjectImportSuccessMessagemsg = injectIntlTranslation(
          intl,
          "ProjectImportSuccessMessage"
        ).replace("_PROJECTNAME_", '"' + projectName + '"');
        showSuccessNotification(ProjectImportSuccessMessagemsg);
        toggleprojectDialog();
        refreshProjectList();
      }
    
    } catch (err) {
      hideLoader();
      setdisableSave(false);
      if (
        (err.response && err.response.status && err.response.status === 409) ||
        (err.response &&
          err.response.data &&
          err.response.data.ECatCode === 1003)
      ) {
        setprojectError(
          injectIntlTranslation(intl, "ProjectNameAlreadyExists")
        );
        setdisableSave(true);
      } else if (err.message) {
        showErrorNotification(
          injectIntlTranslation(intl, "GenericErrorMessage")
        );
      }
    }
  };

  const createImportProjectButton = () => {
    return [
      {
        id: "SaveImportProject",
        name: injectIntlTranslation(intl, "Save"),
        disabled: disableSave,
        onClick: importProject,
      },
    ];
  };

  return (
    <ConfirmModal
      isModalOpen={true}
      title={injectIntlTranslation(intl, "UploadNewProject")}
      fullWidth
      hideCancel
      onClose={toggleprojectDialog}
      actionButtonList={createImportProjectButton()}
    >
      <div className={body}>
        <div className={tagNameContainer}>
          <div className={tagNameLabel}>
            <span> {injectIntlTranslation(intl, "NewProjectProjectName")}</span>
            <span className={requiredAsterik}>*</span>
          </div>
          <div className={tagNameField}>
            <TextField
              id="importProjectName"
              value={projectName}
              variant="outlined"
              required={true}
              InputProps={{
                classes: {
                  notchedOutline: errorClass,
                },
              }}
              name="importProjectName"
              margin={"dense"}
              size={"small"}
              onChange={validateProjectField}
            />
            <span className={errorMsg}>{projectError}</span>
          </div>
        </div>
        <div className={filePosition}>
          <div className={fileDiv}>
            <Button
              id="ChooseFileImportProject"
              size="small"
              className={fileButton}
              onClick={handleClick}
              variant="outlined"
              disableRipple
            >
              {injectIntlTranslation(intl, "ChooseFile")}
            </Button>
            <label title={projectFileName} className={fileLable}>
              {projectFileName
                ? projectFileName
                : injectIntlTranslation(intl, "NoFileChosen")}
            </label>
          </div>
          <input
            id="importProjectName"
            type="file"
            ref={hiddenFileInput}
            onChange={onChangeHandler}
            className={inputActual}
          />
          <span className={errorMsg}>{fileError}</span>
        </div>
      </div>
    </ConfirmModal>
  );
};

export default injectIntl(
  connect(null, {
    showErrorNotification,
    showSuccessNotification,
    refreshProjectList,
    showLoader,
    hideLoader,
  })(ImportProjectDialog)
);
