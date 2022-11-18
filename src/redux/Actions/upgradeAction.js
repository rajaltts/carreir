import { UPGRADE_START, UPGRADE_RESET } from '../constants/constant';
import { upgradeTag, tagUpgradeStatus, appServiceUpgradeTag, refreshProjectList } from "@carrier/workflowui-globalfunctions";

export const upgradeClose = () => (dispatch) => dispatch({ type: UPGRADE_RESET })

export const upgradeStart = (upgradeEligibleTags) => (dispatch, getState) => {
    const { getAllProductsReducer: { builderList }} = getState();
    const upgradeDetails = getUpgradeDetails(builderList, upgradeEligibleTags);
    dispatch({
        type: UPGRADE_START,
        data: {
            tagStatus: upgradeDetails
        }
    });
    let defaultUpgradeIdsList = [];
    let defaultAppServiceUpgradeIdsList = [];
    upgradeDetails.forEach(upgradeDetail => {
        const { onClickHandler, tagInfo, builderId, useMsCall, useRole, useLang } = upgradeDetail;
        const upgradeIdsList = createApiInput(tagInfo, builderId, useMsCall, useRole, useLang);
        if (onClickHandler) {
            onClickHandler(upgradeIdsList, dispatch)
        }
        else {
            if (useMsCall) {
                defaultUpgradeIdsList = [...defaultUpgradeIdsList, ...upgradeIdsList];
            }
            else {
                defaultAppServiceUpgradeIdsList = [...defaultAppServiceUpgradeIdsList, ...upgradeIdsList];
            }
        }
    });
    if (defaultUpgradeIdsList.length) {
        dispatch(upgradeTag({ tagUpgradeInput: defaultUpgradeIdsList }));
    }
    if (defaultAppServiceUpgradeIdsList.length) {
        dispatch(appServiceUpgradeTag({ tagUpgradeInput: defaultAppServiceUpgradeIdsList }));
    }
    dispatch(refreshProjectList())
}

const getUpgradeDetails = (workflows = [], selectedTags) => {
    let upgradeDetails = [];
    workflows.forEach(workflow => {
        const { id: builderId, displayName, upgradeAction = {}, childrenWorkflow, hideChildrenWorkflow } = workflow;
        const { onClickHandler, name, useMsCall = false,useRole = false, useLang  = false } = upgradeAction;
        let builderRelatedTags = selectedTags.filter(selectedTag => selectedTag.ProductBuilder === builderId 
            || (!hideChildrenWorkflow && childrenWorkflow && !!childrenWorkflow.length && childrenWorkflow.filter(children => children.builder === selectedTag.ProductBuilder ).length)
            )
        if (builderRelatedTags.length) {
            let tagInfo = {};
            builderRelatedTags.forEach(tag => {
                const { TagId, TagName, TagModel } = tag;
                tagInfo[TagId] = { tagName: TagName, tagModel: TagModel, status: tagUpgradeStatus.InProgress, upgradeMessage: ""};
            })
            upgradeDetails.push({
                name: (name || displayName),
                builderId: builderRelatedTags[0].ProductBuilder,
                tagInfo: tagInfo,
                onClickHandler: onClickHandler,
                useMsCall: useMsCall,
                useRole : useRole,
                useLang : useLang
            })
        }
    });
    return upgradeDetails;
}

const createApiInput = (tagInfo, builderId, isMsCall = false, isRoleRequired = false, isLangRequired = false) => {
    return Object.keys(tagInfo).map(tagId => {
        if (isMsCall) {
            return { "TagID": tagId, "BuilderID": builderId }
        }
        return { "SelectionID": tagId, "BuilderID": builderId, "IsRoleRequired": isRoleRequired, "IsLangRequired": isLangRequired };
    });
}