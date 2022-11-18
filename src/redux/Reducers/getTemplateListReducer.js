import { GET_TEMPLATE_LIST_FULFILLED, GET_TEMPLATE_LIST_FAILED} from '../constants/constant';

const templateList = {
    templates: [],
    isLoading: false,
    error: ''
};

export default function getTemplateListReducer(state = templateList, action){
  switch(action.type){
    case GET_TEMPLATE_LIST_FULFILLED:
      return {
        ...state,
        isLoading: false,
        templates: action.data
      }
    case GET_TEMPLATE_LIST_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.data
      }
    default:
      return state;
  }
}
