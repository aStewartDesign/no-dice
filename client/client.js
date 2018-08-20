import './css/app.css';

import React from 'react';
import {render} from 'react-dom';

// import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';

import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import {createBrowserHistory} from 'history';

import routes from './js/routes.js';
import {createStore} from './js/reducers.js';

const history = createBrowserHistory();

const state = window.INIT_STATE || {};
const store = createStore(state, history);

const AppRouter = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            {renderRoutes(routes)}
        </ConnectedRouter>
    </Provider>
);

render(<AppRouter />, document.getElementById('app'));
