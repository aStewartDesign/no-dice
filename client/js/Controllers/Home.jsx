import React from 'react';
import { connect } from 'react-redux';
import Dice from '../Components/Dice';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangeNumberOfDice = this.handleChangeNumberOfDice.bind(this);
        this.handleDiceRoll = this.handleDiceRoll.bind(this);
        this.handleLockDice = this.handleLockDice.bind(this);
        this.handleUnlockDice = this.handleUnlockDice.bind(this);
        this.handleClearLockedDice = this.handleClearLockedDice.bind(this);
    }

    render() {
        const { activeDice, lockedDice, totalDice, dispatch } = this.props;
        return (
            <div className="container">
                <h2>Welcome to No-Dice!</h2>
                <div>
                    <p>Let's get playin'!</p>
                    <input type="number" value={totalDice} onChange={this.handleChangeNumberOfDice} />
                </div>
                <hr />
                <div className="dice-group" onClick={this.handleDiceRoll}>
                <div className="dice-group__label">active dice</div>
                    {activeDice.map((d, i) => <Dice value={d} index={i} key={`a${i}`} onClick={this.handleLockDice} dispatch={dispatch} />)}
                </div>
                {
                    lockedDice.length !== 0 && (
                        <div className="dice-group dice-group--locked">
                            <div className="dice-group__label">locked dice</div>
                            {lockedDice.map((d, i) => <Dice value={d} index={i} key={`l${i}`} onClick={this.handleUnlockDice} dispatch={dispatch} />)}
                            <button onClick={this.handleClearLockedDice}>clear</button>
                        </div>
                    )
                }
            </div>
        );
    }

    handleChangeNumberOfDice(e) {
        e.persist();
        this.props.dispatch({
            type: 'CHANGE_NUMBER_OF_DICE',
            value: e.target.value
        });
    }

    handleDiceRoll(e) {
        if (e.target.classList.contains('dice-group')) {
            const { activeDice, dispatch } = this.props;
            const value = [];
            activeDice.forEach(() => {
                value.push(this.getRandomInt(1, 6));
            });
            dispatch({
                type: 'ROLL_DICE',
                value
            });
        }
    }

    handleLockDice(value) {
        const {dispatch} = this.props;
        dispatch({
            type: 'LOCK_DICE',
            value
        });
    }

    handleUnlockDice(value) {
        const {dispatch} = this.props;
        dispatch({
            type: 'UNLOCK_DICE',
            value
        });
    }

    handleClearLockedDice() {
        const {dispatch} = this.props;
        dispatch({
            type: 'CLEAR_LOCKED'
        });
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
            activeDice: state.app.activeDice,
            lockedDice: state.app.lockedDice,
            totalDice: state.app.activeDice.length + state.app.lockedDice.length
        }, ownProps);
    }
)(Home)
