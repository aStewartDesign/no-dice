import {combineReducers, applyMiddleware, createStore as reduxCreateStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {browserHistory} from 'react-router-dom';
import {routerReducer, routerMiddleware} from 'react-router-redux';
// import axiosMiddleware from 'redux-axios-middleware';
// import axios from 'axios';
import thunk from 'redux-thunk';

import {default as appReducer, actions as appActions} from './Controllers/app-reducer';
import {default as diceReducer, actions as diceActions} from './Controllers/dice-reducer';
import {default as farkleReducer, actions as farkleActions} from './Controllers/farkle-reducer';

const reducers = combineReducers({
    app: appReducer,
    dice: diceReducer,
    farkle: farkleReducer,
    router: routerReducer
});

const actions = {
    appActions,
    diceActions,
    farkleActions
};
/*
const client = axios.create({
    baseURL: 'https://api.asdsgn.net/v1',
    responseType: 'json',
    headers: {
        'Content-type': 'application/json'
    }
});
*/

/**
 * Create a Redux store
 * @param {Object} preloadedState Initial state object
 * @param {Object} history history object
 * @returns {Object} redux store
 */
const createStore = (preloadedState = reducers(), history = browserHistory) => {
    return reduxCreateStore(
        reducers,
        preloadedState,
        composeWithDevTools(
            applyMiddleware(
                thunk,
                // axiosMiddleware(client),
                routerMiddleware(history)
            )
    ))
};

export {
    createStore,
    actions,
    reducers
};
