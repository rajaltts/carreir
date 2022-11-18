import { UPDATE_USER_PROFILE, UPDATE_COLUMN_SETTING } from '../constants/constant';

const initialState = {
    firstName: '',
    lastName: '',
    fullName: '',
    initials: '',
    emailAddress: '',
    oldEmailAddress: '',
    groups: [],
    appAccess: false,
    permissions: [],
    userColumnSettings: {}
};

export default function userProfileReducer(state = initialState, action){
    switch(action.type){
        case UPDATE_USER_PROFILE:
            const { firstName, lastName } = action.data;
            return {
                ...state, ...action.data,  fullName:`${firstName} ${lastName}`
            }
        case UPDATE_COLUMN_SETTING:
            return {
                ...state,
                userColumnSettings: {
                    ...state.userColumnSettings,
                    [action.data.key]: action.data.value
                }
            }
        default:
            return state;
    }
}