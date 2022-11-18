import {
    UPDATE_BUILDER_LIST_WITH_PERMISSION,
    UPDATE_ALL_BUILDER_ROUTES } from './../constants/constant';

const initialState = {
    isLoading: false,
    allBuilderRoutes: [],
    builderList: []
};

export default function getAllProductReducer(state = initialState, action){
    switch(action.type){
        case UPDATE_BUILDER_LIST_WITH_PERMISSION:
            return {
                ...state,
                builderList: action.data.builderList
            }
        case UPDATE_ALL_BUILDER_ROUTES:
            return {
                ...state,
                allBuilderRoutes: action.data
            }
        default:
        return state;
    }
}