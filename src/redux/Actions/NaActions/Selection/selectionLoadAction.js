import { GET_INITIAL_SELECTION_LOADING, GET_INITIAL_SELECTION_LOADED, TRUE, FALSE } from "../../../constants/constant.js";
import { GetInitialState, getTranslatedRuleData, HasPermission } from "@carrier/workflowui-globalfunctions";
import appConfig from '../../../../Environment/environments';
import { actionConstants } from "@carrier/workflowui-globalfunctions";

export const getInitialSelectionLoadData = ({ productLine, ruleSet, tags, loadInitialData, userPreferences = [] }) => async (dispatch, getState) => {
  const { locale, userProfile } = getState();
  const { unit, role } = locale;
  dispatch({ type: actionConstants.TAG_DETAILS_LOADING });
  dispatch({ type: GET_INITIAL_SELECTION_LOADING });
  if (loadInitialData) {
    let translateRuleData = await loadInitialData(appConfig.api, unit, role)
    dispatch({ type: GET_INITIAL_SELECTION_LOADED, translateRuleData })
    dispatch({
      type: actionConstants.TAG_DETAILS_LOADED, data: {
        TagSelections: translateRuleData,
      }
    })
  }
  else {
    let initialAssignments = [{ "Name": "User_sUnitOfMeasure", "Value": (unit === "Metric" ? "SI" : "IP") }, { "Name": "User_sLevel", "Value": role }]
    userPreferences.forEach(preference => 
      initialAssignments.push({
        "Name": preference.PropName, 
        "Value": HasPermission(preference.Path, userProfile.permissions) ? TRUE : FALSE
      })
    )
    GetInitialState(
      appConfig.api.rulesAppServices,
      productLine,
      ruleSet,
      tags,
      null,
      initialAssignments
    ).then((data) => {
      let translateRuleData = getTranslatedRuleData(data);
      dispatch({ type: GET_INITIAL_SELECTION_LOADED, translateRuleData })
      dispatch({
        type: actionConstants.TAG_DETAILS_LOADED, data: {
          TagSelections: translateRuleData,
        }
      })
    })
  }
};