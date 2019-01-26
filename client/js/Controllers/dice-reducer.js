const initialState = {
  activeDice: [1, 2, 3, 4, 5, 6],
  lockedDice: [],
  totalValue: 21,
  farkleRollScore: 0,
  farkleLockedScore: 0
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
        farkleRollScore: scoreFarkleRoll(action.value),
        totalValue: (action.value.reduce(sum, 0) + state.lockedDice.reduce(sum, 0))
      });

    case 'LOCK_DICE':
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      value = activeDice.splice(action.value, 1);
      lockedDice.push(value[0]);
      return Object.assign({}, state, {
        activeDice,
        lockedDice,
        farkleLockedScore: scoreFarkleRoll(lockedDice)
      });

    case 'UNLOCK_DICE':
      activeDice = state.activeDice.slice();
      lockedDice = state.lockedDice.slice();
      value = lockedDice.splice(action.value, 1);
      activeDice.push(value[0]);
      return Object.assign({}, state, {
        activeDice,
        lockedDice,
        farkleLockedScore: scoreFarkleRoll(lockedDice)
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

function scoreFarkleRoll(dice = []) {
  dice.sort()
  const diceCount = {};
  const isSixDice = dice.length === 6;
  let isAllUnique = true;
  dice.forEach((d) => {
    if (diceCount.hasOwnProperty(d)) {
      diceCount[d]++;
      isAllUnique = false;
    }
    else {
      diceCount[d] = 1;
    }
  });

  if (isAllUnique && dice.length === 6) {
    return 3000; // 1-6: 3000 pts
  }

  let score = 0;
  let pairs = 0;
  // let triplets = 0;

  for (let value in diceCount) {
    if (diceCount.hasOwnProperty(value)) {
      const count = diceCount[value];
      pairs += count === 2 ? 1 : 0;
      // triplets += count === 3 ? 1 : 0;

      switch (value) {
        case '1':
          score += count > 3
            ? scoreCount(value, count)
            : 100 * count;
          break;

        case '5':
          score += count > 2
            ? scoreCount(value, count)
            : 50 * count;
          break;

        default:
          score += scoreCount(value, count);

      }
    }
  }

  if (pairs === 3) {
    return 1500;
  }

  return score;
}

function scoreCount(value, count) {
  switch (count) {
    case 3:
      return value * 100;

    case 4:
      return 1000;

    case 5:
      return 2000;

    case 6:
      return 3000;

    default:
      return 0;
  }
}

// if 1's score 100 x count
// if 5's score 50 x count unless >= 3
// if n x 2 count pair
// if n x 3 score n x 100; count triplet
// if n x 4 score 1000
// if n x 5 score 2000
// if n x 6 score 3000



/**
 * 
 * 
1	100 points [1]
5	50 points [5]
Three 1's	1,000 points [1,1,1,-,-,-]
Three 2's	200 points [2,2,2,-,-,-]
Three 3's	300 points [3,3,3,-,-,-]
Three 4's	400 points [4,4,4,-,-,-]
Three 5's	500 points []
Three 6's	600 points
x 1-2-3-4-5-6 	3000 points
3 Pairs	1500 points
4 of a kind
5 of a kind
6 of a kind
1-1-1-1-1-1
Two Triplets
3-of-a-kind and a pair
4-of-a-kind and a pair

 */