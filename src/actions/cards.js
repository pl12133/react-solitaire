export const MOVE_CARDS = 'MOVE_CARDS';
export const SHUFFLE_CARDS = 'SHUFFLE_CARDS';
export const FLIP_CARD = 'FLIP_CARD';
export const UNDO_MOVE = 'UNDO_MOVE';
export const REDO_MOVE = 'REDO_MOVE';
export const CLEAR_UNDO_HISTORY = 'CLEAR_UNDO_HISTORY';

export function clearHistory () {
  return {
    type: CLEAR_UNDO_HISTORY
  };
}

export function shuffleCards () {
  return {
    type: SHUFFLE_CARDS
  };
}
export function moveCards (cards, destination) {
  if (!Array.isArray(cards)) {
    cards = [cards];
  }
  return {
    type: MOVE_CARDS,
    cards,
    destination
  };
}
export function flipCard (card) {
  return {
    type: FLIP_CARD,
    card
  };
}
export function undoMove () {
  return {
    type: UNDO_MOVE
  };
}
export function redoMove () {
  return {
    type: REDO_MOVE
  };
}
