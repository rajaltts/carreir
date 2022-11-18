
import {FETCH_RELEASE_NOTES_FULFILLED, FETCH_RELEASE_NOTES_FAILED, CLOSE_RELEASE_NOTES_FULFILLED, CLOSE_RELEASE_NOTES_FAILED, HIDE_RELEASE_NOTES } from '../constants/constant';

const initialState = {
   releaseNotes: [],
   releaseNotesLength:0,
   previousReleaseId:0,
   currentReleaseId:0,
   IsReviewReleaseNote:false,
   showDialog:false
};

export default function (state = initialState, action){
    let showDialog = localStorage.getItem('showDialog');
    switch(action.type) {
        case FETCH_RELEASE_NOTES_FULFILLED: 
            return {
                ...state,
                releaseNotes: action.payload.data,
                releaseNotesLength: action.payload.data.length,
                previousReleaseId: action.payload.minId,
                currentReleaseId: action.payload.maxId,
                IsReviewReleaseNote: action.payload.IsReviewReleaseNote,
                showDialog: showDialog
            }
        case FETCH_RELEASE_NOTES_FAILED:
            return state;
        case CLOSE_RELEASE_NOTES_FULFILLED: 
            return {
                ...state,
                showDialog: showDialog
            }
        case CLOSE_RELEASE_NOTES_FAILED:
            return state;
        case HIDE_RELEASE_NOTES:
            return  {
            ...state,
            showDialog: showDialog
        }
        default:
            return state;
    }
}