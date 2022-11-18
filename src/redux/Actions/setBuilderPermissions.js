import {BUILDER_PERMISSIONS_SET} from '../constants/constant';

export const setBuilderPermissions = (builderPermissions) => (dispatch) => {
    dispatch({ 
        type: BUILDER_PERMISSIONS_SET,
        data: builderPermissions
     });
}
