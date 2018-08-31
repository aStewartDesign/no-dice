import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Dice from '../Components/Dice';
import { actions } from '../reducers';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.handleDiceRoll = this.handleDiceRoll.bind(this);
        this.handleLockDice = this.handleLockDice.bind(this);
        this.handleUnlockDice = this.handleUnlockDice.bind(this);
        this.handleClearLockedDice = this.handleClearLockedDice.bind(this);
    }

    render() {
        const { activeDice, lockedDice, totalDice, totalValue, areOptionsOpen } = this.props;
        return (
            <div className="container">
                <div className="o-box">Total dice value: {totalValue}</div>
                <div className="dice-grid">
                    <div className="o-box dice-group" onClick={this.handleDiceRoll}>
                        <div className="dice-group__label">active dice</div>
                        {activeDice.map((d, i) => <Dice value={d} index={i} key={`a${i}`} onClick={this.handleLockDice} />)}
                        <div className="dice-group__label">
                            {activeDice.length === 0 ? 'No dice!' : 'Tap here to roll'}
                        </div>
                    </div>
                    <div className="dice-group dice-group--locked">
                        <div className="dice-group__label">locked dice</div>
                        {
                            lockedDice.length !== 0
                                && lockedDice.map((d, i) => <Dice value={d} index={i} key={`l${i}`} onClick={this.handleUnlockDice} />)
                        }
                        {
                            lockedDice.length
                                ? (
                                    <button onClick={this.handleClearLockedDice}>clear</button>
                                )
                                : (
                                    <div className="dice-group__label">
                                        No locked dice (tap active dice to lock them)
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleDiceRoll(e) {
        if (!e.target.classList.contains('dice')) {
            const { activeDice } = this.props;
            const numberOfRollingDice = activeDice.length;
            for (let i = 0; i < 5; i++) {
                const value = [];
                for (let j = 0; j < numberOfRollingDice; j++) {
                    value.push(this.getRandomInt(1, 6));
                }
                setTimeout(() => this.props.rollDice(value), i * 100);
            }
        }
    }

    handleLockDice(value) {
        this.props.lockDice(value);
    }

    handleUnlockDice(value) {
        this.props.unlockDice(value);
    }

    handleClearLockedDice() {
        this.props.clearLocked();
    }

    /**
     * Get a random number between a minimum and maximum number
     * Thanks MDN! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
     * @param {Number} min Minimum number
     * @param {Number} max Maximum number
     */
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
}

Home.defaultProps = {
    activeDice: [],
    lockedDice: []
};

export default connect(
    (state, ownProps) => {
        return Object.assign({
            activeDice: state.dice.activeDice,
            lockedDice: state.dice.lockedDice,
            totalDice: state.dice.activeDice.length + state.dice.lockedDice.length,
            totalValue: state.dice.totalValue,
            areOptionsOpen: state.app.areOptionsOpen
        }, ownProps);
    },
    Object.assign({}, actions.appActions, actions.diceActions)
)(Home);
