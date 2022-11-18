import { CSO_CALCULATION_START, CSO_CALCULATION_FULFILLED } from '../constants/constant';
import appConfig from '../../Environment/environments';
import { ApiService, generatePdfReport, generateCD5, endPoints, guid } from "@carrier/workflowui-globalfunctions";

export const getCalcType = (builderId, successCallback) => (dispatch) => {
  dispatch({ type: CSO_CALCULATION_START });
  ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_PRODUCTBUILDER_CALCULATION_TYPE}${builderId}`, 'GET').then(res => {
    const calcType = res.data.filter(item => item.Name === "CSO")[0];
    successCallback(calcType);
  })
};

export const csoCalculation = (requestObj, successCallback, failureCallback, type = false) => (dispatch) => {
  const URL = (type) ? endPoints.CSO_NA_CALCULATION : endPoints.CSO_CALCULATION;

  ApiService(`${appConfig.api.eCatAppService}${URL}`, 'POST', requestObj).then(res => {
    dispatch({
      type: CSO_CALCULATION_FULFILLED
    });
    type ? fetchRetry(res.data, requestObj.TagIds, successCallback, failureCallback, type) : fetchRetryEMEA(res.data, requestObj.TagIds, successCallback, failureCallback, type)
  }).catch(err => {
    failureCallback(err.response);
  });
};

const filterTagAndStatus = (csoExportReqObject, selectedTagList, tagId, status) => {
  const csoExportReqInput = csoExportReqObject.filter(item => item.TagId !== tagId);
  const tagObject = selectedTagList.filter(item => item.SelectionID === tagId);
  tagObject[0]['Status'] = status;
  const tagStatusObject = { "CSOExportReqObject": csoExportReqInput, "TagName": tagObject[0].TagName };

  return tagStatusObject;
}

const fetchRetry = (result, selectedTagList, successCallback, failureCallback, type = 0) => {
  let csoExportReqObject = result;
  let popUpBlockStatus = false;
  let csoExportResult = csoExportReqObject && csoExportReqObject.filter(item => item.CalculationStatus === 0 || item.CalculationStatus === 2);

  if(csoExportResult && csoExportResult.length > 0){
    csoExportResult.forEach(element => {
      if(element.CalculationStatus === 0){
        const tagObject = filterTagAndStatus(csoExportReqObject, selectedTagList, element.TagId, 0);
        csoExportReqObject = tagObject.CSOExportReqObject;
      } else {
        const popupBlockAction = () => {
          popUpBlockStatus = true;
          }
  
        const tagObject = filterTagAndStatus(csoExportReqObject, selectedTagList, element.TagId, 1);
        csoExportReqObject = tagObject.CSOExportReqObject;
        downLoadFiles(element, type, popupBlockAction, tagObject.TagName);
      }
    });
  }
  if(csoExportReqObject && csoExportReqObject.length > 0){
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_NA_CSO}`, 'POST', csoExportReqObject).then(res => {
      var intervalID = setTimeout(() => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].CalculationStatus === 0) {
            const tagObject = filterTagAndStatus(csoExportReqObject, selectedTagList, res.data[i].TagId, 0);
            csoExportReqObject = tagObject.CSOExportReqObject;
          } else if (res.data[i].CalculationStatus === 2) {
            // eslint-disable-next-line no-loop-func
            const popupBlockAction = () => {
              popUpBlockStatus = true;
            }

            const tagObject = filterTagAndStatus(csoExportReqObject, selectedTagList, res.data[i].TagId, 1);
            csoExportReqObject = tagObject.CSOExportReqObject;
            downLoadFiles(res.data[i], type, popupBlockAction, tagObject.TagName);
          }
        }

        // Check if all tags CSO calculation completed??
        if (csoExportReqObject.length > 0) {
          fetchRetry(csoExportReqObject, selectedTagList, successCallback, failureCallback, type);
        }
        else {
          window.clearInterval(intervalID);
          successCallback(popUpBlockStatus, selectedTagList);
        }
      }, 5000);
    }).catch(err => {
      failureCallback();
    });
  } else {
    successCallback(popUpBlockStatus, selectedTagList);
  }
};

const fetchRetryEMEA = (result, selectedTagList, successCallback, failureCallback, type = 0) => {
  const URL = endPoints.GET_PACKAGE_CHILLER_CSO;
  const id = result;
  ApiService(`${appConfig.api.eCatAppService}${URL}${id}`, 'GET').then(res => {
    var intervalID = setTimeout(() => {
      if (res.data.CalculationStatus === 0) {
        failureCallback();
      } else if (res.data.CalculationStatus === 1 || res.data.CalculationStatus === 3) {
        fetchRetryEMEA(id, selectedTagList, successCallback, failureCallback, type);
      } else if (res.data.CalculationStatus === 2) {
        window.clearInterval(intervalID);
        let popUpBlockStatus = false;
        const popupBlockAction = () => {
          popUpBlockStatus = true;
        }

        let tagName = (selectedTagList && selectedTagList.length > 0) ? selectedTagList[0].TagName : null;
        downLoadFiles(res.data, type, popupBlockAction, tagName);
        selectedTagList[0]['Status'] = 1;
        successCallback(popUpBlockStatus, selectedTagList);
      }
    }, 5000);
  }).catch(err => {
    failureCallback();
  });
};

const downLoadFiles = (csoData, type, popupBlockAction, tagName) => {
  if (type) {
    const pdfContent = csoData.CSOExportFiles[0].ExportFileContent;
    const pdfFileName = csoData.CSOExportFiles[0].ExportFileIdentifier;
    const cd5Content = csoData.CSOExportFiles[1].ExportFileContent;
    const cd5FileName = (tagName) ? tagName + ".cd5" : csoData.CSOExportFiles[1].ExportFileIdentifier;
    generatePdfReport(pdfContent, pdfFileName, true, false, popupBlockAction);
    generateCD5(cd5Content, cd5FileName);
    if(csoData.CSOExportFiles.length > 2)
    {
      generateCD5(csoData.CSOExportFiles[2].ExportFileContent, "LowLoad_" + cd5FileName);
    }
  }
  else {
    const cd5Content = csoData.CSOExportFiles[0].ExportFileContent;
    const cd5FileName = (tagName) ? tagName + ".cd5" : csoData.CSOExportFiles[0].ExportFileIdentifier;
    generateCD5(cd5Content, cd5FileName);
  }
}

export const downLoadCd5MSFile = (stream, tagName) => {
  if (stream) {
    const cd5FileName = (tagName) ? `${tagName}.cd5` : `${guid()}.cd5`
    generateCD5(stream, cd5FileName);
  }
}