export const MOVE_CARD = 'MOVE_CARD';
export const SHUFFLE_CARDS = 'SHUFFLE_CARDS';

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
