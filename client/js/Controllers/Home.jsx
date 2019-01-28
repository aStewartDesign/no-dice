import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Anime from 'react-anime';
import Dice from '../Components/Dice';
import Timer from '../Components/Timer';
import { actions } from '../reducers';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.tapsTimeoutId = null;
    }

    render() {
        const { activeDice, lockedDice, totalDice, totalValue, areOptionsOpen, farkleRollScore,
            farkleSavedScoreThisRoll, numberOfRolls, farkleTurnScore, isFirstRoll, rollCountDown
        } = this.props;
        return (
            <div className="dice-grid">
                <div className="o-box dice-group" onClick={this.handleDiceTap}>
                    <div className="dice-group__label">
                        active dice
                        {
                            !isFirstRoll && (
                                <span>
                                    <span className="dice-group__sub-label"><strong>total dice value:</strong> {totalValue} |</span>
                                    <span className="dice-group__sub-label"><strong>farkle roll score:</strong> {farkleRollScore} {farkleRollScore === 0 ? 'Farkle!' : ''}</span>
                                </span>
                            )
                        }
                    </div>
                    {activeDice.map((d, i) => <Dice value={d.value} index={i} key={d.key} onClick={this.handleLockDice} />)}
                    <div className="dice-group__label">
                        {
                            activeDice.length === 0
                                ? 'no dice!'
                                : numberOfRolls > 0
                                    ? (
                                        <span>
                                            {/*
                                            <span classNames={classnames({'u-bold': rollCountDown === 3, 'u-gray': rollCountDown !== 3})}>3</span>&nbsp;
                                            <span classNames={classnames({'u-bold': rollCountDown === 2, 'u-gray': rollCountDown !== 2})}>2</span>&nbsp;
                                            <span classNames={classnames({'u-bold': rollCountDown === 1, 'u-gray': rollCountDown !== 1})}>1</span>
                                            */}
                                            {
                                                rollCountDown > 0
                                                    ? `rolling ${numberOfRolls}x in ${rollCountDown}...`
                                                    : (
                                                        <span classNames="u-bold">ROLL!</span>
                                                    )
                                            }
                                        </span>
                                    )
                                    : 'tap here to roll'
                        }
                    </div>
                </div>
                <div className="dice-group dice-group--locked">
                    <div className="dice-group__label">
                        locked dice
                        <span className="dice-group__sub-label"><strong>farkle saved score:</strong> {farkleSavedScoreThisRoll}</span>
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

    handleDiceTap = (e) => {
        if (!e.target.classList.contains('dice') || !e.target.classList.contains('cancel')) {
            const {numberOfRolls, countRoll, startCountDown} = this.props;
            if (numberOfRolls < 10) {
                countRoll();
                this.handleCancelRoll();
                startCountDown();
                this.tapsTimeoutId = window.setInterval(this.handleCountDown, 800);
            }
        }
    }

    handleCountDown = () => {
        const {decrementCountDown, rollCountDown} = this.props;
        if (rollCountDown > 0) {
            decrementCountDown();
        }
        else {
            this.handleDiceRoll();
        }
    }

    handleCancelRoll = () => {
        if (this.tapsTimeoutId) {
            window.clearTimeout(this.tapsTimeoutId);
        }
    }

    handleDiceRoll = () => {
        const { activeDice, numberOfRolls, farkleSavedScoreThisRoll, setTurnScore, farkleTurnScore } = this.props;
        const numberOfRollingDice = activeDice.length;
        if (farkleSavedScoreThisRoll) {
            setTurnScore(farkleSavedScoreThisRoll + farkleTurnScore);
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

    handleLockDice = (index) => {
        const {lockDice, activeDice, setSavedScore} = this.props;
        lockDice(index);
        setSavedScore(activeDice[index].value);
    }

    handleUnlockDice = (index) => {
        const {unlockDice, unsetSavedScore} = this.props;
        unlockDice(index);
        unsetSavedScore(index);
    }

    handleClearLockedDice = () => {
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
            farkleSavedScoreThisRoll: state.farkle.savedScoreThisRoll,
            farkleTurnScore: state.farkle.turnScore,
            numberOfRolls: state.dice.numberOfRolls,
            isFirstRoll: state.farkle.isFirstRoll,
            rollCountDown: state.dice.countDown
        }, ownProps);
    },
    Object.assign({}, actions.appActions, actions.diceActions, actions.farkleActions)
)(Home);
