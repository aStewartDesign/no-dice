const initialState = {
  activeDice: [1, 2, 3, 4, 5, 6],
  lockedDice: [],
  totalValue: 21
};

export default function reducer(state = initialState, action = {type: null}) {
  let activeDice;
  let lockedDice;
  let value;
  const sum = (i, v) => i + v;
  switch (action.type) {

    case 'CHANGE_NUMBER_OF_DICE':
      const diff = action.value - (state.activeDice.length + state.lockedDice.length);
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          activeDice.push(1);
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
        activeDice: action.value,
        totalValue: (action.value.reduce(sum, 0) + state.lockedDice.reduce(sum, 0))
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
  }
};
