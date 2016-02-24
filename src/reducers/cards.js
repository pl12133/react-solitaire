import { MOVE_CARDS, SHUFFLE_CARDS, FLIP_CARD, UNDO_MOVE, REDO_MOVE } from '../actions/cards';

/* Undoable setup */
import undoable, { includeAction } from 'redux-undo';

// Cards state is an array of 52 objects of form {name, location}
function makeDeck () {
  let initDeck = () => {
    let memo = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['two', 'three', 'four', 'five', 'six', 'seven',
                  'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];

    suits.forEach((suit) => {
      values.forEach((value) => {
        let str = value + '-of-' + suit;
        memo.push({name: str, location: 'TABLE', flipped: true});
      });
    });

    return memo;
  };
  let deck = initDeck();
  console.log('Using Deck: ', deck);
  return deck;
}
const initialState = makeDeck();

function shuffle (array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function deal (cards) {
  let count = 0;
  for (let index = 1; index <= 7; ++index) {
    for (let innerIndex = index; innerIndex <= 7; ++innerIndex) {
      let card = cards[count++];
      card.flipped = (innerIndex !== index);
      card.location = 'STACK-' + innerIndex;
    }
  }
  while (count < cards.length) {
    let card = cards[count++];
    card.flipped = true;
    card.location = 'DEAL-AREA-FACEDOWN';
  }
  return cards;
}

function card (state = initialState, action) {
  switch (action.type) {
    case SHUFFLE_CARDS:
      return deal(shuffle(initialState));
    case MOVE_CARDS: {
      return [
        ...state.filter(stateCard => !action.cards.some(card => card.name === stateCard.name)),
        ...action.cards.map(card => ({
          name: card.name,
          location: action.destination,
          flipped: card.flipped
        }))
      ];
    }
    case FLIP_CARD: {
      return [
        ...state.filter((elem) => elem.name !== action.card.name), {
          name: action.card.name,
          location: action.card.location,
          flipped: !action.card.flipped
        }
      ];
    }
    default:
      return state;
  }
}

let undoConfig = {
  filter: includeAction([MOVE_CARDS]),
  limit: 128,
  undoType: UNDO_MOVE,
  redoType: REDO_MOVE
};

export default undoable(card, undoConfig);
