import { UPDATE_PROJECT_GRID_STATE } from '../constants/constant';

export const updateProjectGridState = (props) => (dispatch) => {
    dispatch({
        type: UPDATE_PROJECT_GRID_STATE,
        data: { ...props }
    });
}