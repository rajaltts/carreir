import { SHOW_SUCCESS_NOTIFICATION, SHOW_ERROR_NOTIFICATION, SHOW_WARNING_NOTIFICATION, SHOW_INFO_NOTIFICATION,
    HIDE_NOTIFICATION } from '../constants/constant';
import { Success, Error, Warning, Info } from '../../utilities/constants/Constants';

const initialState = {
    visible: false,
    statusType: '',
    notificationText: '',
    isAutohide: true,
    showProgress: false
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_SUCCESS_NOTIFICATION:
            return getNextState(state, action.data, Success);
        case SHOW_ERROR_NOTIFICATION:
            return getNextState(state, action.data, Error);
        case SHOW_WARNING_NOTIFICATION:
            return getNextState(state, action.data, Warning);
        case SHOW_INFO_NOTIFICATION:
            return getNextState(state, action.data, Info);
        case HIDE_NOTIFICATION:
            return { ...initialState }
        default:
            return state;
    }
}

const getNextState = (state, notificationData, statusType) => {
    return {
        ...state,
        visible: true,
        statusType,
        ...notificationData,
    }
}