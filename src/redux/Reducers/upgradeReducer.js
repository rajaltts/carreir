import { actionConstants } from "@carrier/workflowui-globalfunctions";
import { UPGRADE_START, UPGRADE_RESET } from '../constants/constant';
import cloneDeep from 'lodash/cloneDeep';
import { tagUpgradeStatus as tagStatusConstants } from "@carrier/workflowui-globalfunctions";

const upgradeTagStatus = {
  tagsUpgradeStatus: [],
  isUpgradeCompleted: false
};

export default function upgradeReducer(state = upgradeTagStatus, action) {
  switch (action.type) {
    case UPGRADE_START:
      return {
        ...state,
        tagsUpgradeStatus: action.data.tagStatus
      }
    case actionConstants.TAG_UPGRADED:
      return upgradeDetailsUpdate(state, action.data);
    case UPGRADE_RESET:
      return upgradeTagStatus;
    default:
      return state;
  }
}

const upgradeDetailsUpdate = (state, newTagsUpgradeStatus) => {
  const { tagsUpgradeStatus } = state;
  let newTagsUpgradeResult = cloneDeep(tagsUpgradeStatus);
  let isAllTagsStatusUpdated = true;
  Object.keys(newTagsUpgradeStatus).forEach((key) => {
    newTagsUpgradeResult.forEach((tagUpgradeStatus, index) => {
      const { tagInfo } = tagUpgradeStatus;
      if (tagInfo.hasOwnProperty(key)) {
        newTagsUpgradeResult[index].tagInfo[key].status = newTagsUpgradeStatus[key].status;
        newTagsUpgradeResult[index].tagInfo[key].upgradeMessage = newTagsUpgradeStatus[key].message;
      }
    })
  });

  for (const tagUpgradeResult of newTagsUpgradeResult) {
    const { tagInfo } = tagUpgradeResult;
    for (let x in tagInfo) {
      if (tagInfo[x].status === tagStatusConstants.InProgress) {
        isAllTagsStatusUpdated = false;
        break;
      }
    }
    if (!isAllTagsStatusUpdated) {
      break
    }
  }

  return {
    ...state,
    tagsUpgradeStatus: newTagsUpgradeResult,
    isUpgradeCompleted: isAllTagsStatusUpdated
  }
}