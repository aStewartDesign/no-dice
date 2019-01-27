import hb from 'handlebars';
import React from 'react';
import PropTypes from 'prop-types';
import {renderToString} from 'react-dom/server';

// import {StaticRouter} from 'react-router-dom';
import {matchRoutes, renderRoutes} from 'react-router-config';
import {ConnectedRouter} from 'react-router-redux';
import {Router} from 'react-router-dom';
import {createMemoryHistory, parsePath} from 'history';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import routes from '../client/js/routes.js';
import {createStore, reducers} from '../client/js/reducers.js';
import index from '../client/index.hbs';

class StaticReduxRouter extends React.Component {

    getChildContext() {
        return {
            router: {
                staticContext: this.props.context
            }
        };
    }

    render() {
        return this.props.children;
    }
}

StaticReduxRouter.propTypes = {
    context: PropTypes.object.isRequired
};
StaticReduxRouter.childContextTypes = {
    router: PropTypes.object.isRequired
};

export const render = (event, context, callback) => {

    global.localStorage = {
        getItem() { return null; },
        setItem() { },
        deleteItem() { }
    };
    global.window = {localStorage: global.localStorage};

    const response = {
        statusCode: 200,
        body: '',
        headers: {
            'content-type': 'text/html'
        }
    };
    const ct = hb.compile(index);
    const state = reducers();
    const history = createMemoryHistory({
        initialEntries: [parsePath(event.path)],
        initialIndex: 0
    });
    const store = createStore(state, history);
    const routerContext = {};
    const data = {
        data: JSON.stringify(state),
        content: renderToString(
            <Provider store={store}>
                <StaticReduxRouter context={routerContext}>
                    <ConnectedRouter history={history}>
                        {renderRoutes(routes)}
                    </ConnectedRouter>
                </StaticReduxRouter>
            </Provider>
        ),
        title: 'No-Dice | asdsgn.net',
        stylesheets: [
            'https://cdn.rawgit.com/tonsky/FiraCode/1.205/distr/fira_code.css',
            'https://s3-us-west-2.amazonaws.com/no-dice.asdsgn.net/app.css'
        ],
        scripts: [
            'https://s3-us-west-2.amazonaws.com/no-dice.asdsgn.net/client.js'
        ]
    };
    response.body = ct(data);
    if(routerContext.status === 404) {
        response.statusCode = 404;
    }

    callback(null, response);
};
