const initialState = {
  areOptionsOpen: false
};

export default function reducer(state = initialState, action = {type: null}) {
  switch (action.type) {

    case 'SET_OPTIONS_OPEN':
      return Object.assign({}, state, {
        areOptionsOpen: action.value
      });

    default:
      return state;
  }
}

export const actions = {
  setOptionsOpen(value) {
    return {
      type: 'SET_OPTIONS_OPEN',
      value
    };
  }
};
