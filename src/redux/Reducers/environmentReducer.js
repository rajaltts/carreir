import appConfig from '../../Environment/environments';

const initialState = {
    ...appConfig.api
};

export default function environmentReducer (state = initialState, action){
    return state;
}
