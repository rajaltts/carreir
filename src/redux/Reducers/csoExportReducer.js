import { CSOEXPORTDIALOUGE_ISOPEN } from '../constants/constant';

const initialState = {
  openDialouge: false,
  builderId: ""
};

export default function csoExportReducer(state = initialState, action){
  if (action.type === CSOEXPORTDIALOUGE_ISOPEN) {
    return {
      ...state,
      openDialouge: action.data.flag,
      builderId: action.data.builderId
    }
  }
  else {
    return state;
  }
}
