import {BUILDER_PERMISSIONS_SET} from '../constants/constant';

const initialState = {
    builderPermissions: {}
};

export default function setBuilderPermissionsReducer(state = initialState, action){
    switch(action.type){
        case BUILDER_PERMISSIONS_SET:
            return {
                ...state,
                builderPermissions: action.data
            }
        default:
        return state;
    }
}