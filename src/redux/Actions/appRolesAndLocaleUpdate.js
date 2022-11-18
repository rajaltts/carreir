import { setBuilderPermissions } from "./setBuilderPermissions";
import { updateBuilderPermission } from "./getAllProducts";
import { UserPerference, updateUserProfile, updateUserRoles, getLocale, fetchColumnSettings } from './userPerference';
import { getLanguageDetails } from '../../utilities/languagesutils';

const createBuilderPermissions = (data, builderPermissions, isChildern = false) => {
  data.childSettings.forEach((builder) => {
    if (builder.settingName === "Packaged Chillers EMEA") {
      builderPermissions[builder.settingName] = true;
    }
    else {
      const isChildernAvailable = (builder.childSettings && (builder.childSettings.length > 0));
      let shouldShowBuilder = false;
      if (isChildernAvailable || isChildern) {
        shouldShowBuilder = true;
      }
      builderPermissions[builder.settingName] = shouldShowBuilder;
      if (isChildernAvailable) {
        createBuilderPermissions(builder, builderPermissions, true);
      }
    }
  });
  return builderPermissions;
}

export const updatePermissionsAndLocale = ({data, userRoles}) => (dispatch, getState) => {
  const { permissions } = data;
  let builderPermissions = {};

  dispatch(updateUserProfile(data));

  permissions.forEach((value) => {
    if (value.settingName === "Platform Permissions") {
      value.childSettings.forEach((item) => {
        if (item.settingName === "User Roles") {
          userRoles = item.childSettings.map(userole => userole.settingName)
          dispatch(updateUserRoles(userRoles));
        }
      })
    }
    else if (value.settingName === "Builders Permissions") {
      builderPermissions = createBuilderPermissions(value, builderPermissions);
      dispatch(setBuilderPermissions(builderPermissions));
      dispatch(updateBuilderPermission(value));
    }
    
  })
  
  const preferences = fetchColumnSettings(data.userPreferenceModels);
  const userPreference = preferences['UserPreference'];

  if (userPreference) {
    dispatch(getLocale(userPreference))
  }
  else {
    const { locale: { unit, name } } = getState();
    const language = getLanguageDetails(name);
    dispatch(UserPerference({
      opt: language,
      unit: unit,
      role: userRoles[0],
      isUnitChange: false
    }));
  }
}

export const checkAndUpdateUserPerference = ({dispatch, name, role, unit, userRoles}) => {
  const language = getLanguageDetails(name);
  if ((!role && !!userRoles.length) || (role && userRoles.indexOf(role) <= -1)) {
    dispatch(UserPerference({
      opt: language,
      unit: unit,
      role: userRoles[0],
      isUnitChange: false
    }));
  } else {
    if (!(language && language.name && unit && role)) {
      dispatch(UserPerference({
        opt: language,
        unit: unit,
        role: role,
        isUnitChange: false
      }));
    }
  }
}