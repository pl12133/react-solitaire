import ReactDOM from 'react-dom';

export const DRAGDROP_BEGIN_DRAG = 'DRAGDROP_BEGIN_DRAG'
export const DRAGDROP_END_DRAG = 'DRAGDROP_END_DRAG'

export function beginDrag(cards) {
  let origins = cards.map((elem) => {
    return ReactDOM.findDOMNode(elem);
  });
  return {
    type: DRAGDROP_BEGIN_DRAG,
    cards,
    origins
  }
}
export function endDrag() {
  return {
    type: DRAGDROP_END_DRAG,
  }
}
