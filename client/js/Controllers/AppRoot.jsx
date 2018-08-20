import React from 'react';
import Link from 'react-router-dom/Link';
import { renderRoutes } from 'react-router-config';
import {connect} from 'react-redux';
import _ from 'lodash';

class AppRoot extends React.Component {

    render() {
        return (
            <div>
                <header className="header">
                    <div className="container">
                        
                        <h1 className="header__title">
                            <Link className="header__title-link" to="/">No-Dice</Link>
                        </h1>
                        <p className="header__sub-title">The app to use when you have no dice.</p>
                    </div>
                </header>
                <main>
                    {renderRoutes(this.props.route.routes)}
                </main>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        return _.assign({}, state.app, ownProps);
    }
)(AppRoot);
