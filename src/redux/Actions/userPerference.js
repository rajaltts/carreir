import {
    LOCALE_SET_FULFILLED,
    LOCALE_SET_FAILED,
    UPDATE_USER_PROFILE,
    LOCALE_UPDATE_USER_ROLES,
    UPDATE_MESSAGES,
    LOCALE_SET_STARTED,
} from '../constants/constant';
import { getLanguageDetails } from '../../utilities/languagesutils';
import messages from '../../utilities/messages';
import { checkAndUpdateUserPerference } from './appRolesAndLocaleUpdate';
import { ApiService, endPoints } from "@carrier/workflowui-globalfunctions";

export const getLocale = (preferences) => async(dispatch, getState) => {
    const { locale: { userRoles, message }} = getState();
    dispatch({ type: LOCALE_SET_STARTED });
    const { Language, UnitSystem, Role } = preferences;
    const { name, lang, fullLangCode, leafLocale, transKey} = getLanguageDetails(Language);
    let newMessage
    if (leafLocale) {
        newMessage = await messages[leafLocale]()
    } else {
        newMessage = message;
    }
    dispatch({
        type: LOCALE_SET_FULFILLED,
        data: { lang, UnitSystem, Language: name, Role, fullLangCode, leafLocale, message: newMessage, transKey}
    });
    if (!!userRoles.length && userRoles[0] !== "Anonymous") {
        checkAndUpdateUserPerference({dispatch, name, role: Role, unit: UnitSystem, userRoles})
    }
}

export const updateUserRoles = (userRoles) => (dispatch) => {
    dispatch({
        type: LOCALE_UPDATE_USER_ROLES,
        data: {userRoles: userRoles}
    })
}

export const UserPerference = (props) => (dispatch, getState) => {
    const { opt, unit, role, isUnitChange, succesCallback = "", failureCallback = "" } = props;
    var jsonData = {
        "UnitSystem": unit,
        "Language": opt.name,
        "SalesEntity": "",
        "IsCacheClear": "",
        "Role":role
     }
    const { api: { userManagement, appAcessURl } } = getState();
    const data = {"AppUrl":appAcessURl,"SettingName":"UserPreference","SettingValue": JSON.stringify(jsonData)}
    Promise.all([
        ApiService(`${userManagement}${endPoints.POST_USER_PREFERENCE}`, 'POST', data),
        messages[opt.leafLocale]() 
    ]).then(([result, message]) => {
        sessionStorage.ecatLang = JSON.stringify({ lang: opt.lang, Language: opt.name});
        const { fullLangCode, leafLocale, transKey} = getLanguageDetails(opt.name);
        dispatch({
            type: LOCALE_SET_FULFILLED,
            data: {...jsonData, lang: opt.lang, Role: role, fullLangCode, leafLocale, message, transKey}
        })
        isUnitChange && succesCallback();
    }).catch((request) => { 
        isUnitChange && failureCallback();
    });
};

export const updateUserProfile = (data) => (dispatch) => {
    const initials = `${data.lastName.substring(0, 6).toLowerCase()}${data.firstName[0].toLowerCase()}`;
    const userColumnSettings = fetchColumnSettings(data.userPreferenceModels)
    const updatedData = {...data, initials, userColumnSettings: userColumnSettings };
    dispatch({ type: UPDATE_USER_PROFILE, data: updatedData });
};

export const getMessageString = (leafLocale) => async (dispatch) => {
    const message =  await messages[leafLocale]();
    dispatch({ type: UPDATE_MESSAGES, data: message})
}

export const fetchColumnSettings = (userPreferenceModels) => {
    const { preferences = [] } =  userPreferenceModels[0] || {};
    let columnOptions = {};
    preferences.forEach(preference => {
        columnOptions[preference.settingName] = JSON.parse(preference.settingValue);
    });
    return columnOptions;
}