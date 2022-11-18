import { CSO_CALCULATION_START, CSO_CALCULATION_FULFILLED, CSO_CALCULATION_FAILED } from '../constants/constant';

const initialState = {
  loading: false,
  error: '',
};

export default function csoCalculationReducer(state = initialState, action) {
  switch (action.type) {
    case CSO_CALCULATION_START:
      return {
        loading: true,
      }
    case CSO_CALCULATION_FULFILLED:
      return {
        ...state,
        loading: false,

      }
    case CSO_CALCULATION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.data
      }
    default:
      return state;
  }
}
