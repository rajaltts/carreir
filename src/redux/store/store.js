import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../Reducers/rootReducer";

const middleware = [thunk];

const composeEnhancers = (process.env.NODE_ENV === "development" && typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: "eCAT-UI",
        trace: true,
    })
    :
    compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(rootReducer, enhancer);

export default store;