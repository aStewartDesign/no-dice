import uuid from 'uuid/v4';
const initialState = {
  activeDice: [
    {
      key: uuid(),
      value: 1
    },
    {
      key: uuid(),
      value: 2
    },
    {
      key: uuid(),
      value: 3
    },
    {
      key: uuid(),
      value: 4
    },
    {
      key: uuid(),
      value: 5
    },
    {
      key: uuid(),
      value: 6
    }
  ],
  lockedDice: [],
  totalValue: 21,
  numberOfRolls: 0,
  countDown: 3
};

export default function reducer(state = initialState, action = {type: null}) {
  let activeDice;
  let lockedDice;
  let value;
  const sum = (i, v) => i + v;
  const createDice = (value) => ({value, key: uuid()});
  switch (action.type) {

    case 'CHANGE_NUMBER_OF_DICE':
      const diff = action.value - (state.activeDice.length + state.lockedDice.length);
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          activeDice.push({
            value: 1,
            key: `d${activeDice.length + lockedDice.length - 1}`
          });
        }
      }

      if (diff < 0) {
        const remainder = activeDice.length + diff;
        if (remainder < 0) {
          activeDice = [];
          lockedDice.splice(0, (remainder * -1));
        } else {
          activeDice.splice(0, (diff * -1));
        }
      }

      return Object.assign({}, state, {activeDice, lockedDice});

    case 'ROLL_DICE':
      return Object.assign({}, state, {
        activeDice: state.activeDice.map((d, i) => Object.assign({}, d, {value: action.value[i]})),
        totalValue: (action.value.reduce(sum, 0) + state.lockedDice.map((d) => d.value).reduce(sum, 0)),
        numberOfRolls: 0
      });

    case 'LOCK_DICE':
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      value = activeDice.splice(action.value, 1);
      lockedDice.push(value[0]);
      return Object.assign({}, state, {
        activeDice,
        lockedDice
      });

    case 'UNLOCK_DICE':
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      value = lockedDice.splice(action.value, 1);
      activeDice.push(value[0]);
      return Object.assign({}, state, {
        activeDice,
        lockedDice
      });

    case 'CLEAR_LOCKED':
      return Object.assign({}, state, {
        activeDice: state.activeDice.concat(state.lockedDice),
        lockedDice: []
      });

    case 'COUNT_ROLL':
      return Object.assign({}, state, {numberOfRolls: state.numberOfRolls + 1});

    case 'START_COUNT_DOWN':
      return Object.assign({}, state, {countDown: 3});

    case 'COUNT_DOWN':
      return Object.assign({}, state, {countDown: state.countDown - 1});

    default:
      return state;
  }
}

export const actions = {
  changeNumberOfDice(value) {
    return {
      type: 'CHANGE_NUMBER_OF_DICE',
      value
    };
  },
  countRoll() {
    return {
      type: 'COUNT_ROLL'
    }
  },
  rollDice(value) {
    return {
      type: 'ROLL_DICE',
      value
    };
  },
  lockDice(value) {
    return {
      type: 'LOCK_DICE',
      value
    };
  },
  unlockDice(value) {
    return {
      type: 'UNLOCK_DICE',
      value
    };
  },
  clearLocked() {
    return {
      type: 'CLEAR_LOCKED'
    };
  },
  startCountDown() {
    return {
      type: 'START_COUNT_DOWN'
    }
  },
  decrementCountDown() {
    return {
      type: 'COUNT_DOWN'
    }
  }
};
