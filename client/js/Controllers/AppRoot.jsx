import React from 'react';
import Link from 'react-router-dom/Link';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { actions } from '../reducers';
import { renderRoutes } from 'react-router-config';
import {connect} from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';


class AppRoot extends React.Component {

    constructor(props) {
        super(props);
        this.handleToggleOptions = this.handleToggleOptions.bind(this);
        this.handleChangeNumberOfDice = this.handleChangeNumberOfDice.bind(this);
    }

    render() {
        const {totalDice, areOptionsOpen} = this.props;

        return (
            <div className={classnames('c-app', {
                'c-app--sidebar-open': areOptionsOpen
            })}>
                <div className="c-app__sidebar">
                    <Sidebar
                        totalDice={totalDice}
                        handleChangeNumberOfDice={this.handleChangeNumberOfDice}
                        />
                </div>
                <div className="c-app__main">
                    <Header
                        handleToggleOptions={this.handleToggleOptions}
                        areOptionsOpen={areOptionsOpen}
                        />
                    <main className="c-app__content">
                        {renderRoutes(this.props.route.routes)}
                    </main>
                </div>
            </div>
        );
    }

    handleToggleOptions() {
        const { setOptionsOpen, areOptionsOpen } = this.props;
        setOptionsOpen(!areOptionsOpen);
    }

    handleChangeNumberOfDice(e) {
        this.props.changeNumberOfDice(e.target.value);
    }
}

export default connect(
    (state, ownProps) => {
        return Object.assign({
            totalDice: state.dice.activeDice.length + state.dice.lockedDice.length,
            areOptionsOpen: state.app.areOptionsOpen
        }, ownProps);
    },
    Object.assign({}, actions.appActions, actions.diceActions)
)(AppRoot);
