import {
  GET_CONCEPT_TEMPLATE_FAILED, GET_CONCEPT_TEMPLATE_FULFILLED, GET_CONCEPT_TEMPLATE_START, DELETE_CONCEPT_TEMPLATE_FULFILLED
} from '../constants/constant';

const initialState = {
  records: [],
  isLoading: false,
  error: '',
};
export function ConceptTemplatesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONCEPT_TEMPLATE_START:
      return {
        ...state,
        isLoading: false
      }
    case GET_CONCEPT_TEMPLATE_FULFILLED:
      return {
        ...state,
        isLoading: true,
        records: action.data,
      }
    case DELETE_CONCEPT_TEMPLATE_FULFILLED:
      return {
        ...state,
        isLoading: true,
        records: state.records.filter((item) =>  item.SubTemplateID !== action.TemplateId)
      }
    case GET_CONCEPT_TEMPLATE_FAILED:
      return {
        ...state,
        isLoading: true,
        error: action.data
      }
    default:
      return state;
  }
}


 