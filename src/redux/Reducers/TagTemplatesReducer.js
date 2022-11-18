
import {
  GET_TAG_TEMPLATE_FAILED, GET_TAG_TEMPLATE_FULFILLED, GET_TAG_TEMPLATE_START,
  SAVE_TAG_TEMPLATE_FAILED, SAVE_TAG_TEMPLATE_FULFILLED, SAVE_TAG_TEMPLATE_START,
  UPDATE_TAG_TEMPLATE_START, UPDATE_TAG_TEMPLATE_FULFILLED, UPDATE_TAG_TEMPLATE_FAILED,
  DELETE_TAGTEMPLATE_FULFILLED
} from '../constants/constant';

const initialState = {
  records: [],
  isLoading: false,
  error: ''
};

export function getTagTemplatesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TAG_TEMPLATE_START:
      return {
        ...state,
        isLoading: false
      }
    case GET_TAG_TEMPLATE_FULFILLED:
      return {
        ...state,
        isLoading: true,
        records: action.data,
      }
    case GET_TAG_TEMPLATE_FAILED:
      return {
        ...state,
        isLoading: true,
        error: action.data
      }
    default:
      return state;
  }
}

export function updateTagTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAG_TEMPLATE_START:
      return {
        ...state,
        isLoading: false
      }
    case UPDATE_TAG_TEMPLATE_FULFILLED:
      return {
        ...state,
        isLoading: true,
        records: action.data,
      }
    case UPDATE_TAG_TEMPLATE_FAILED:
      return {
        ...state,
        isLoading: true,
        error: action.data
      }
    default:
      return state;
  }
}


export function deleteTagTemplateReducer(state = initialState, action) {
  if (action.type === DELETE_TAGTEMPLATE_FULFILLED) {
    return {
      ...state,
      isLoading: false,
      records: action.data
    }
  }
  else {
    return state;
  }
}

export function saveTagTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_TAG_TEMPLATE_START:
      return {
        ...state,
        isLoading: false
      }
    case SAVE_TAG_TEMPLATE_FULFILLED:
      return {
        ...state,
        isLoading: true,
        records: action.data,
      }
    case SAVE_TAG_TEMPLATE_FAILED:
      return {
        ...state,
        isLoading: true,
        error: action.data
      }
    default:
      return state;
  }
}