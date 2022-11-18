import appConfig from '../../Environment/environments';
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";

export const upgradeTag = (data, item, getTagStatus, getTagStatusFailed) => () => {
  ApiService(`${appConfig.api.eCatAppService}${endPoints.POST_UPGRADE_SELECTION}`, 'POST', data)
    .then(res => {
      getTagStatus(res.data, item);
    })
    .catch(err => {
      getTagStatusFailed(err.response, item);
    });
}

export const upgradeTagStatus = (data, item, sucessCallBack, failureCallBack) => () => {
  ApiService(`${appConfig.api.eCatAppService}${endPoints.UPGRADETAG_STATUS}`, 'POST', data)
    .then(res => {
      sucessCallBack(res.data, item);
    })
    .catch(err => {
      failureCallBack(err.response, item);
    });
}


