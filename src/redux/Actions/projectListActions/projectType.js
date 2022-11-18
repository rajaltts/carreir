
import { UPDATE_PROJECT_GRID_TAb } from '../../constants/constant';

export const updateProjectType = (projectType) => (dispatch) => {
    dispatch({type: UPDATE_PROJECT_GRID_TAb, data: {projectType}})
}