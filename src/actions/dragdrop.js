import ReactDOM from 'react-dom';

export const DRAGDROP_BEGIN_DRAG = 'DRAGDROP_BEGIN_DRAG'
export const DRAGDROP_END_DRAG = 'DRAGDROP_END_DRAG'
export const DRAGDROP_DO_DRAG = 'DRAGDROP_DO_DRAG'

export function doDrag(card, mousePosition) {
  return {
    type: DRAGDROP_DO_DRAG,
    card,
    mousePosition
  }
}
export function beginDrag(card) {
  let origin = ReactDOM.findDOMNode(card);
  return {
    type: DRAGDROP_BEGIN_DRAG,
    card,
    origin
  }
}
export function endDrag(card) {
  return {
    type: DRAGDROP_END_DRAG,
    card
  }
}
