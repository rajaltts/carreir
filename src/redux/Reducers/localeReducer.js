import { LOCALE_SET_FULFILLED, LOCALE_SET_FAILED, LOCALE_UPDATE_USER_ROLES, UPDATE_MESSAGES, LOCALE_SET_STARTED } from '../constants/constant';

const initialState = {
    lang: 'en',
    name: 'English',
    unit: 'Metric',
    error: '',
    fullLangCode: 'en-US',
    leafLocale: "en",
    message: {},
    role: { name: "anonymous" },
    userRoles: ["Anonymous"],
    isLoading: false,
    transKey: "",
};

export default function localeReducer(state = initialState, action){
    switch(action.type){
        case LOCALE_SET_STARTED:
            return {
                ...state,
                isLoading: true
            }
        case LOCALE_SET_FULFILLED:
            return {
                ...state,
                lang: action.data.lang,
                name: action.data.Language,
                unit: action.data.UnitSystem,
                role: action.data.Role,
                fullLangCode: action.data.fullLangCode,
                leafLocale: action.data.leafLocale,
                message: action.data.message.default,
                transKey: action.data.transKey,
                isLoading: false
            }
        case LOCALE_SET_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case LOCALE_UPDATE_USER_ROLES:
            return {
                ...state,
                userRoles: action.data.userRoles
            }
        case UPDATE_MESSAGES:
            return {
                ...state,
                message: action.data
            }
        default:
            return state;
    }
}