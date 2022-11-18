import { 
  REFRESH_TAG_GRID, TAG_UPDATING, TAG_UPDATED, CLEAR_TAG_LIST, GET_TAG_LIST_START, GET_TAG_LIST_FULFILLED,
  GET_TAG_LIST_FAILED, UPDATE_SELECTED_TAGS_LIST, TAG_COLUMN_OPTIONS_LOADING_START, TAG_COLUMN_OPTIONS_LOADING_STOP,
  LOCK_ID_UPDATE, LOCK_ID_UPDATE_WITH_WARNING
} from '../constants/constant';
import { tagDataKeys } from '@carrier/workflowui-globalfunctions';
import find from 'lodash/find';
import get from 'lodash/get';

const getDefaultTagGridActions = () => {
  const { IsCompare, IsCsoExport, IsGenerateOrder, IsGenerateSubmittal, IsExportToQP, IsMultiTagEdit, IsGenerateReports } = tagDataKeys
  return {
    [IsCompare]: false,
    [IsCsoExport]: false,
    [IsGenerateOrder]: false,
    [IsGenerateSubmittal]: false,
    [IsExportToQP]: false,
    [IsMultiTagEdit] : false,
    [IsGenerateReports] : false
  }
}

const tagList = {
  tags: [],
  tagGridActions: getDefaultTagGridActions(),
  selectedTags: [],
  needRefresh: false,
  isLoading: false,
  error: '',
  tagUpdating: false,
  lockedID: '',
  resetTimer: false,
  lockedMessage: { UserName: undefined, RemainingTime: 30 },
  checkForTagLockWarning: false
};

export default function getTagListReducer(state = tagList, action) {
  switch (action.type) {
    case GET_TAG_LIST_START:
      return {
        ...state,
        error: '',
        isLoading: true,
        selectedTags: [],
        needRefresh: false
      }
    case GET_TAG_LIST_FULFILLED:
      const tagGridActions = getTagGridActions(action.data);
      return {
        ...state,
        isLoading: false,
        tags: action.data,
        tagGridActions,
        error: '',
        selectedTags: [],
        needRefresh: false
      }
    case GET_TAG_LIST_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.data,
        needRefresh: false
      }
    case CLEAR_TAG_LIST:
      return {
        ...tagList,
        selectedTags: []
      }
    case TAG_UPDATING:
      return {
        ...state,
        tagUpdating: true,
      }
    case TAG_UPDATED:
      return {
        ...state,
        tagUpdating: false,
      }
    case REFRESH_TAG_GRID:
      return {
        ...state,
        selectedTags: [],
        needRefresh: true
      }
    case UPDATE_SELECTED_TAGS_LIST:
      return {
        ...state,
        selectedTags: action.data
      }
    case TAG_COLUMN_OPTIONS_LOADING_START:
      return {
        ...state,
        isLoading: true,
      }
    case TAG_COLUMN_OPTIONS_LOADING_STOP:
      return {
        ...state,
        isLoading: false,
      }
    case LOCK_ID_UPDATE:
      return {
        ...state,
        ...action.data,
      }
    case LOCK_ID_UPDATE_WITH_WARNING:
      return {
        ...state,
        lockedID: action.data.lockedID,
        lockedMessage: action.data.lockedMessage,
        resetTimer: action.data.resetTimer,
        checkForTagLockWarning: action.data.checkForTagLockWarning        
      }
    default:
      return state;
  }
}

export const getTagGridActions = (tagArray) => {
  const { IsCompare, IsCsoExport, IsGenerateOrder, IsGenerateSubmittal, IsExportToQP, IsMultiTagEdit, IsGenerateReports } = tagDataKeys
  const tagGridActions = getDefaultTagGridActions();
  try {
    const tagKeys = [IsCompare, IsCsoExport, IsGenerateOrder, IsGenerateSubmittal, IsExportToQP, IsMultiTagEdit, IsGenerateReports];
    for (const tagKey of tagKeys) {
      setTagGridActions(tagKey, tagArray, tagGridActions);
    }
    return tagGridActions;
  }
  catch (e) {
    return tagGridActions;
  }
}

const setTagGridActions = (tagKey, tags, tagGridActions) => {
  const { UIBuilderDetails, GridActions, Enable, IsCompare } = tagDataKeys
  const enabledTag = find(tags, (tag) => get(tag, `${UIBuilderDetails}.${GridActions}.${tagKey}.${Enable}`));
  if (enabledTag) {
    tagGridActions[tagKey] = true;
    if (tagKey === IsCompare) {
      tagGridActions[tagKey] = tags.length > 1
    }
  }
}
