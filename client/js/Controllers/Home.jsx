import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Dice from '../Components/Dice';
import { actions } from '../reducers';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.handleDiceRoll = this.handleDiceRoll.bind(this);
        this.handleDiceTap = this.handleDiceTap.bind(this);
        this.handleLockDice = this.handleLockDice.bind(this);
        this.handleUnlockDice = this.handleUnlockDice.bind(this);
        this.scoreLockedDice = this.scoreLockedDice.bind(this);
        this.handleClearLockedDice = this.handleClearLockedDice.bind(this);
        this.tapsTimeoutId = null;
    }

    render() {
        const { activeDice, lockedDice, totalDice, totalValue, areOptionsOpen, farkleRollScore,
            farkleLockedScore, numberOfRolls, farkleTurnScore
        } = this.props;
        return (
            <div className="dice-grid">
                <div className="o-box dice-group" onClick={this.handleDiceTap}>
                    <div className="dice-group__label">
                        active dice
                        <span className="dice-group__sub-label"><strong>total dice value:</strong> {totalValue} |</span>
                        <span className="dice-group__sub-label"><strong>farkle roll score:</strong> {farkleRollScore} {farkleRollScore === 0 ? 'Farkle!' : ''}</span>
                    </div>
                    {activeDice.map((d, i) => <Dice value={d.value} index={i} key={d.key} onClick={this.handleLockDice} />)}
                    <div className="dice-group__label">
                        {
                            activeDice.length === 0
                                ? 'no dice!'
                                : numberOfRolls > 0
                                    ? `rolling ${numberOfRolls}x...`
                                    : 'tap here to roll'
                        }
                    </div>
                </div>
                <div className="dice-group dice-group--locked">
                    <div className="dice-group__label">
                        locked dice
                        <span className="dice-group__sub-label"><strong>farkle saved score:</strong> {farkleLockedScore}</span>
                        <span className="dice-group__sub-label"><strong>farkle turn score:</strong> {farkleTurnScore}</span>
                    </div>
                    {
                        lockedDice.length !== 0
                            && lockedDice.map((d, i) => <Dice value={d.value} index={i} key={d.key} onClick={this.handleUnlockDice} />)
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
        );
    }

    handleDiceTap(e) {
        if (!e.target.classList.contains('dice')) {
            const {numberOfRolls, countRoll} = this.props;
            if (numberOfRolls < 10) {
                countRoll();
                if (this.tapsTimeoutId) {
                    window.clearTimeout(this.tapsTimeoutId);
                }
                this.tapsTimeoutId = window.setTimeout(this.handleDiceRoll, 1500);
            }
        }
    }

    handleDiceRoll() {
        const { activeDice, numberOfRolls, farkleLockedScore, setTurnScore, setSavedScore } = this.props;
        const numberOfRollingDice = activeDice.length;
        if (farkleLockedScore) {
            setTurnScore(farkleLockedScore);
            setSavedScore([]);
        }
        for (let i = 0; i < numberOfRolls; i++) {
            const value = [];
            for (let j = 0; j < numberOfRollingDice; j++) {
                value.push(this.getRandomInt(1, 7));
            }
            setTimeout(() => {
                if (i < (numberOfRolls - 1)) {
                    this.props.rollDice(value);
                }
                else {
                    this.props.rollDice(value);
                    this.props.setRollScore(value);
                }
            }, i * 100);
        }
    }

    handleLockDice(index) {
        const {lockDice} = this.props;
        lockDice(index);
        this.scoreLockedDice(index);
    }

    handleUnlockDice(index) {
        const {unlockDice} = this.props;
        unlockDice(index);
        this.scoreLockedDice(index);
    }

    scoreLockedDice(index) {
        const {lockedDice, activeDice, setSavedScore} = this.props;
        const scoreDice = lockedDice.map((d) => d.value);
        scoreDice.push(activeDice[index].value);
        setSavedScore(scoreDice);
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
            areOptionsOpen: state.app.areOptionsOpen,
            farkleRollScore: state.farkle.rollScore,
            farkleLockedScore: state.farkle.savedScore,
            farkleTurnScore: state.farkle.turnScore,
            numberOfRolls: state.dice.numberOfRolls
        }, ownProps);
    },
    Object.assign({}, actions.appActions, actions.diceActions, actions.farkleActions)
)(Home);
