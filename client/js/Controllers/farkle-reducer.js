const initialState = {
    rollScore: 0,
    savedScoreThisRoll: 0,
    savedDiceThisRoll: [],
    turnScore: 0,
    isFirstRoll: true
};

export default function reducer(state = initialState, action = {type: null}) {
    const { value } = action;
    let savedDiceThisRoll;
    let savedScoreThisRoll;

    switch (action.type) {

        case 'CLEAR_SCORE':
            return Object.assign({}, state, initialState);

        case 'SET_ROLL_SCORE':
            return Object.assign({}, state, {
                rollScore: scoreFarkleRoll(value),
                savedScoreThisRoll: 0,
                savedDiceThisRoll: [],
                isFirstRoll: false
            });

        case 'SET_SAVED_SCORE':
            savedDiceThisRoll = state.savedDiceThisRoll.slice();
            savedDiceThisRoll.push(value);
            savedScoreThisRoll = scoreFarkleRoll(savedDiceThisRoll);
            return Object.assign({}, state, {
                savedScoreThisRoll,
                savedDiceThisRoll
            });

        case 'UNSET_SAVED_SCORE':
            savedDiceThisRoll = state.savedDiceThisRoll.slice();
            savedDiceThisRoll.splice(action.value, 1);
            return Object.assign({}, state, {
                savedScoreThisRoll: scoreFarkleRoll(savedDiceThisRoll),
                savedDiceThisRoll
            });

        case 'SET_TURN_SCORE':
            return Object.assign({}, state, {
                turnScore: value
            });

        case 'RESET_TURN':
            return Object.assign({}, state, initialState);

        default:
            return state;
    }
}

export const actions = {
    clearScore() {
        return {
            type: 'CLEAR_SCORE'
        };
    },
    setRollScore(dice = []) {
        return {
            type: 'SET_ROLL_SCORE',
            value: dice
        };
    },
    setSavedScore(value) {
        return {
            type: 'SET_SAVED_SCORE',
            value
        };
    },
    unsetSavedScore(index) {
        return {
            type: 'UNSET_SAVED_SCORE',
            value: index
        };
    },
    setTurnScore(score = 0) {
        return {
            type: 'SET_TURN_SCORE',
            value: score
        }
    },
    resetTurn() {
        return {
            type: 'RESET_TURN'
        }
    }
};





function scoreFarkleRoll(dice = []) {
    dice.sort()
    const diceCount = {};
    // const isSixDice = dice.length === 6;
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