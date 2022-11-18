import { FETCH_RELEASE_NOTES_FULFILLED, FETCH_RELEASE_NOTES_FAILED, CLOSE_RELEASE_NOTES_FULFILLED, CLOSE_RELEASE_NOTES_FAILED, BUILDERS_PERMISSIONS, HIDE_RELEASE_NOTES} from '../constants/constant';
import appConfig from '../../Environment/environments';
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";
import { encryptData } from '../../components/common/Utilities';

export const getReleaseNotesData = (IsUserSpecific,IsReviewReleaseNote,Permissions) => (dispatch) => {

    let releaseNotesPayload = {
        "IsUserSpecific": IsUserSpecific,
        "IsReviewReleaseNote": IsReviewReleaseNote,
        "Permissions":  Permissions
    };
    
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_RELEASE_NOTES_DATA}`, 'POST', releaseNotesPayload)
    .then(res => {
       let IdList = [...new Set(res.data.map(item => item.Id))];
       let minId = Math.min(...IdList);
       let maxId = Math.max(...IdList);
        dispatch({
            type: FETCH_RELEASE_NOTES_FULFILLED,
            payload: {data:res.data, minId, maxId, IsReviewReleaseNote}
        });
    }).catch(error => {
        dispatch({
            type: FETCH_RELEASE_NOTES_FAILED,
            data: error
        })
    });
};

export const closeReleaseNotes = (previousReleaseId, currentReleaseId ) => (dispatch) => {
  ApiService(`${appConfig.api.eCatAppService}${endPoints.SAVE_RELEASE_NOTES}?previousReleaseId=${previousReleaseId}&currentReleaseId=${currentReleaseId}`, 'POST')
  .then(res => {
      dispatch({
          type: CLOSE_RELEASE_NOTES_FULFILLED,
          data: res.data
      });
    }).catch(error => {
        dispatch({
            type: CLOSE_RELEASE_NOTES_FAILED,
            data: error
        })
    });
};

export const hideDialog = () => (dispatch) => {
    dispatch({ type: HIDE_RELEASE_NOTES});
};

export const getAllBuildersPermissions = (sucessCallBack) => (dispatch) => {
        ApiService(`${appConfig.api.userManagement}${endPoints.GET_APP_PERMISSIONS}appurl=${encryptData(appConfig.api.appAcessURl).toString()}`, 'get')
        .then(res => {
            res.data.permissions.forEach((value) => {
                if (value.settingName === BUILDERS_PERMISSIONS) {
                    var builderPermissions =  value.childSettings;
                    if(builderPermissions !== null || undefined){
                         let allPermissions = [...new Set(builderPermissions.map(item => item.settingName))];
                         sucessCallBack(allPermissions);
                    }
                 }
            })
        });
}




