import AppRoot from './Controllers/AppRoot.jsx';
import Home from './Controllers/Home.jsx';
import NotFound from './Controllers/NotFound.jsx';

const routes = [
    {
        component: AppRoot,
        routes: [
            {
                path: '/',
                exact: true,
                component: Home
            },
            {
                path: '*',
                component: Home
                // component: NotFound
            }
        ]
    }
];

export default routes;