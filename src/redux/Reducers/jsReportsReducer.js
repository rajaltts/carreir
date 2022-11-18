import { actionConstants } from "@carrier/workflowui-globalfunctions";

const {
  EMEA_JSREPORT_SAVE,
  EMEA_JSREPORT_REMOVE,
  EMEA_JSREPORT_GET_LOOKUP_START,
  EMEA_JSREPORT_GET_LOOKUP_FULFILLED,
  EMEA_JSREPORT_GET_LOOKUP_FAILED,
  EMEA_JSREPORT_GET_CALCENGINE_START,
  EMEA_JSREPORT_GET_CALCENGINE_FULFILLED,
  EMEA_JSREPORT_GET_CALCENGINE_FAILED,
  EMEA_JSREPORT_GET_ECODESIGN_START,
  EMEA_JSREPORT_GET_ECODESIGN_FULFILLED,
  EMEA_JSREPORT_GET_ECODESIGN_FAILED,
} = actionConstants;

const initialReportsState = {
  reports: [],
  lastUpdate: null,
};

export default function jsReportsReducer(state = initialReportsState, action) {
  switch (action.type) {
    case EMEA_JSREPORT_SAVE:
      state.reports[action.id] = action.data;
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_REMOVE:
      state.reports[action.index].global.removed = true;
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_LOOKUP_START:
      state.reports[action.index].global.status.lookup = {
        ...state.reports[action.index].global.status.lookup,
        ...{
          isLoading: true,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_LOOKUP_FULFILLED:
      state.reports[action.index].global.status.lookup = {
        ...state.reports[action.index].global.status.lookup,
        ...{
          output: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_LOOKUP_FAILED:
      state.reports[action.index].global.status.lookup = {
        ...state.reports[action.index].global.status.lookup,
        ...{
          error: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_CALCENGINE_START:
      state.reports[action.index].global.status.calcEngine = {
        ...state.reports[action.index].global.status.calcEngine,
        ...{
          isLoading: true,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_CALCENGINE_FULFILLED:
      state.reports[action.index].global.status.calcEngine = {
        ...state.reports[action.index].global.status.calcEngine,
        ...{
          output: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_CALCENGINE_FAILED:
      state.reports[action.index].global.status.calcEngine = {
        ...state.reports[action.index].global.status.calcEngine,
        ...{ error: action.data, isLoading: false },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_ECODESIGN_START:
      state.reports[action.index].global.status.ecodesign = {
        ...state.reports[action.index].global.status.ecodesign,
        ...{
          isLoading: true,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_ECODESIGN_FULFILLED:
      state.reports[action.index].global.status.ecodesign = {
        ...state.reports[action.index].global.status.ecodesign,
        ...{
          output: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case EMEA_JSREPORT_GET_ECODESIGN_FAILED:
      state.reports[action.index].global.status.ecodesign = {
        ...state.reports[action.index].global.status.ecodesign,
        ...{
          error: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case "EMEA_JSREPORT_CALL_PCC_START":
      state.reports[action.index].global.status.pcc = {
        ...state.reports[action.index].global.status.pcc,
        ...{
          isLoading: true,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case "EMEA_JSREPORT_CALL_PCC_FULFILLED_VALID":
    case "EMEA_JSREPORT_CALL_PCC_FULFILLED_INVALID":
      state.reports[action.index].global.status.pcc = {
        ...state.reports[action.index].global.status.pcc,
        ...{
          output: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    case "EMEA_JSREPORT_CALL_PCC_FAILED":
      state.reports[action.index].global.status.pcc = {
        ...state.reports[action.index].global.status.pcc,
        ...{
          error: action.data,
          isLoading: false,
        },
      };
      state.lastUpdate = new Date();
      return state;

    default:
      return state;
  }
}
