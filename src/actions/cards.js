export const MOVE_CARD = 'MOVE_CARD';
export const SHUFFLE_CARDS = 'SHUFFLE_CARDS';
export const FLIP_CARD = 'FLIP_CARD';
export const UNDO_MOVE = 'UNDO_MOVE';
export const REDO_MOVE = 'REDO_MOVE';

export function shuffleCards() {
  return {
    type: SHUFFLE_CARDS
  }
}
export function moveCard(card, destination) {
  return {
    type: MOVE_CARD,
    card,
    destination
  }
}
export function flipCard(card) {
  return {
    type: FLIP_CARD,
    card
  }
}
export function undoMove() {
  return {
    type: UNDO_MOVE
  }
}
export function redoMove() {
  return {
    type: REDO_MOVE 
  }
}
