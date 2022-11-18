import { tagDataKeys, tagActionsType } from "@carrier/workflowui-globalfunctions";

export const fetchModelIdBasedRecords = ({ uniqueKey, tagList, selectedModel, productBuilder, selectedModelId='' }) => {
    const matchingRecords = tagList.filter(item => {
        if(getGridActionForTag(uniqueKey,item))
         {
            const { TagModel, ProductBuilder } = item;
            if ((TagModel === selectedModel) && (ProductBuilder === productBuilder)) {
                return true;
            } else if (selectedModelId === ProductBuilder) {
                return true
            } else {
                return false;
            }
        }
        return false
    });
    return matchingRecords;
}

export const getGridActionForTag = ( uniqueKey, item ) => {
    const { Enable } = tagDataKeys;
    return getGridActionValueForTag(uniqueKey, item, Enable);
}

export const getGridActionValueForTag = ( uniqueKey, item, key ) => {
    const { UIBuilderDetails, GridActions } = tagDataKeys;
    if (item[UIBuilderDetails] && item[UIBuilderDetails][GridActions] && item[UIBuilderDetails][GridActions][uniqueKey]) {
        return item[UIBuilderDetails][GridActions][uniqueKey][key]
    }
    return false
}

export const fetchUpgradeEnableTags = ({ tagList }) => {
    const upgradeEnableRecords = tagList.filter(item => {
        const { UIBuilderDetails, TagActions, Enable } = tagDataKeys;
        const { IsUpgrade } = tagActionsType;
        if (item[UIBuilderDetails] && item[UIBuilderDetails][TagActions] ) {
            const tagAction = item[UIBuilderDetails][TagActions].filter(tagAction => tagAction.action === IsUpgrade)[0];
            const isUpgradeEnable = tagAction ? tagAction[Enable] : false;
            if (isUpgradeEnable) {
                return true;
            }
            else {
                return false;
            }
        }
        return false
    });
    return upgradeEnableRecords;
}

export const getSelectedBuilderTagEnabled = (selectedTags, uniqueKey) => {
  return selectedTags.some(function(tag) {
    return getGridActionForTag(uniqueKey, tag);
  });
}

export const isProductFamilySupported = (selectedTags, item, key) => {
    const productFamily = [...new Set(selectedTags.map(tag => {
        const value = getGridActionValueForTag(item, tag, key)
        if (value) return value;
        return null;
    }))]
    return (productFamily.length === 1);
}