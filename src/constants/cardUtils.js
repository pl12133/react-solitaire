function getCardSuit(card) {
  let { name } = card;
  let suit = name.substr(name.lastIndexOf('-') + 1);
  return suit;

}
function getCardColor(card) {
  let { name } = card;
  let suit = name.substr(name.lastIndexOf('-') + 1);
  switch (suit) {
    case 'hearts':
    case 'diamonds':
      return 'red';
    case 'spades':
    case 'clubs':
      return 'black';

    default:
      return 'blank';
  }
}
function getCardValue(card) {
  let { name } = card;
  let value = name.substr(0, name.indexOf('-'))
  switch (value) {
    case 'ace': return 1;
    case 'two': return 2;
    case 'three': return 3;
    case 'four': return 4;
    case 'five': return 5;
    case 'six': return 6;
    case 'seven': return 7;
    case 'eight': return 8;
    case 'nine': return 9;
    case 'ten': return 10;
    case 'jack': return 11;
    case 'queen': return 12;
    case 'king': return 13;

    default: return 0;
  }
}

export default { getCardValue, getCardSuit, getCardColor };
