
import { FETCH_PROJECTLIST_START, FETCH_PROJECTLIST_FULFILLED, FETCH_PROJECTLIST_FAILED,
    NEED_PROJECTLIST_REFRESH, UPDATE_PROJECT_GRID_STATE, UPDATE_PROJECT_GRID_TAb } from '../constants/constant';
import { projectListColumn, sortingOrder, projectType } from '@carrier/workflowui-globalfunctions';

const initialState = {
    records: [],
    totalCount: 0,
    NewlySharedProjectsCount: 0,
    isLoading: false,
    needRefresh: false,
    error: '',
    order: sortingOrder.descending,
    orderBy: projectListColumn.LastModifiedDate,
    rowsPerPage: 100,
    page: 0,
    searchColumn: 'all',
    searchText: "",
    selectedFilter: "DisplayAll",
    projectType: projectType.AllProjects
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_PROJECTLIST_START:
            return {
                ...state,
                needRefresh: false,
                isLoading: true
            }
        case FETCH_PROJECTLIST_FULFILLED:
            return {
                ...state,
                isLoading: false,
                needRefresh: false,
                totalCount: action.data.TotalCount,
                NewlySharedProjectsCount: action.data.NewlySharedProjectsCount,
                records: action.data.Projects
            }
        case FETCH_PROJECTLIST_FAILED:
            return {
                ...state,
                isLoading: false,
                needRefresh: false,
                error: action.data
            }
        case UPDATE_PROJECT_GRID_STATE:
            return {
                ...state,
                ...action.data
            }
        case NEED_PROJECTLIST_REFRESH:
            return {
                ...state,
                needRefresh: true
            }
        case UPDATE_PROJECT_GRID_TAb:
            return {
                ...state,
                page: 0,
                needRefresh: true,
                records: [],
                totalCount: 0,
                projectType: action.data.projectType
            }
        default:
            return state;
    }
}