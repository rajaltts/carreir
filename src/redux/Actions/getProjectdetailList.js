import { FETCH_PROJECTDETAILLIST_START, RESET_PROJECTDETAILLIST, FETCH_PROJECTDETAILLIST_FULFILLED,FETCH_PROJECTDETAILLIST_FAILED } from '../constants/constant';
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";
import appConfig from '../../Environment/environments';


export const getProjectDetailList = (ProjectId,PageNum=1,PageSize=100,SortColumn='lastmodifieddate',UserRoleId='') => (dispatch) => {
    dispatch({ type: FETCH_PROJECTDETAILLIST_START})    
    
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_PROJECTDETAILLIST}`, 'GET', null, null, null, {
        ProjectId: ProjectId,
        PageNum: PageNum,
        PageSize: PageSize,
        SortColumn: SortColumn,
        UserRoleId: UserRoleId
    }).then(res => {   
        let payload = res.data.map(dataItem => Object.assign({ selected: false }, dataItem));
        dispatch({
            type: FETCH_PROJECTDETAILLIST_FULFILLED,
            data: payload 
        });
    }).catch(error => {
        dispatch({
            type: FETCH_PROJECTDETAILLIST_FAILED,
            data: error
        })
    });
};

export const getAllProjectDetailList = (ProjectId, selectedModelId, UserRoleId='',sucessCallBack, filterRecords, isCsoInputSupported=false) => () => {
    
    let ObjParams = {
      ProjectId: ProjectId,
      PageNum: 1,
      PageSize: 0,
      SortColumn: "lastmodifieddate",
      UserRoleId: UserRoleId,
    };
    
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_PROJECTDETAILLIST}`, 'GET', null, null, null, ObjParams).then(res => {
        let result = [];
        let productBuilder = null;
        let IsSAPSupported = false;
        if (filterRecords) {
            result = filterRecords(res.data) || [];
        }
        else {
            res.data.forEach(item => {
                if ((item.IsSAPSupported || item.IsOrderFileSupported) && (item.SelectedModelId === selectedModelId)) {
                    result.push(item);
                }
                else if(item.ProductBuilder === selectedModelId && item.Status === 1) {
                    result.push(item);
                }
            });
        }
        if (result.length>0) {
            productBuilder = result[0].ProductBuilder;
            IsSAPSupported = isCsoInputSupported;
        }
        sucessCallBack(result, selectedModelId, productBuilder, IsSAPSupported);
    });
};

export const generateSubmittalOrderFile = (requestPayload, sucessCallBack, failureCallBack) => () => {
    ApiService(`${appConfig.api.eCatAppService}${endPoints.GET_PROJECT_REPORT}`, 'POST', requestPayload).then(res => {
        sucessCallBack(res.data);
    }).catch(error => {
        failureCallBack(error);
    });
};

export const resetProjectDetailList = () => (dispatch) => {
    dispatch({ type: RESET_PROJECTDETAILLIST});
};
