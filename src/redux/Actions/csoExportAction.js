import { CSOEXPORTDIALOUGE_ISOPEN } from '../constants/constant.js';

export const csoExportOpenDialouge = (flag, builderId) => (dispatch) => {    
  dispatch({
    type: CSOEXPORTDIALOUGE_ISOPEN,
    data: {flag, builderId}
  })
}