import { MOVE_CARD, SHUFFLE_CARDS, FLIP_CARD } from 'actions/cards'

//Cards state is an array of 52 objects of form {name, location}
//
function makeDeck() {
  // deck only generates once
  let initDeck = () => {
    let memo = [];
//    if (memo.length)
//      return memo;

    const suits = ['hearts', 'diamonds', 'clubs', 'spades']
    const values = ['two', 'three', 'four', 'five', 'six', 'seven',
                  'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace']

    suits.forEach((suit) => {
      values.forEach((value) => {
        let str = value + '-of-' + suit;
        memo.push({name: str, location: 'TABLE', flipped: true});
      })
    })

    return memo;
  }
  let deck = initDeck();
  console.log('Using Deck: ', deck);
  return deck;
}
const initialState = makeDeck();

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  console.log('Shuffled: ' + array.map((elem) => elem.name).join(', '));
  return array;
}

export default function card(state = initialState, action) {
  switch (action.type) {
    case SHUFFLE_CARDS:
      return shuffle(initialState);
    case MOVE_CARD: {
      let next = state.filter((elem) => {
        return (elem.name !== action.card.name);
      }).concat({name: action.card.name,
                 location: action.destination,
                 flipped: action.card.flipped});
      return next;
    }
    case FLIP_CARD: {
      let next = state.filter((elem) => {
        return (elem.name !== action.card.name);
      }).concat({name: action.card.name,
                 location: action.card.location,
                 flipped: !action.card.flipped});

      return next;
    }
    default:
      return state;
  }

}
