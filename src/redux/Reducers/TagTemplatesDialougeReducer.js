import { OPEN_SAVE_POPUP, OPEN_DIALOUGE, OPEN_DELETE_DIALOUGE, OPEN_REPLACE_DIALOUGE, TAG_DATA  } from '../constants/constant.js';

const initialState = {
  open: false,
  openDialouge: false,
  openDeleteDialouge: false,
  openReplaceDialouge: false,
  dataItem: []
};

export function TagTemplateOpenDialouge(state = initialState, action){
  switch(action.type){
    case OPEN_SAVE_POPUP:
      return {
        ...state,
        open: action.data.flag,
        dataItem: action.data.data
      }
    
    case OPEN_DIALOUGE:
      return {
        ...state,
        openDialouge: action.data.flag,
        dataItem: action.data.data
      }
    
    case OPEN_DELETE_DIALOUGE:
      return {
        ...state,
        openDeleteDialouge: action.data.flag,
        dataItem: action.data.data
      }
    
    case OPEN_REPLACE_DIALOUGE:
      return {
        ...state,
        openReplaceDialouge: action.data.flag,
        dataItem: action.data.data
      }
    case TAG_DATA:
      return {
        ...state,
        dataItem: action.data
      }
    
    default:
    return state;
  }
}