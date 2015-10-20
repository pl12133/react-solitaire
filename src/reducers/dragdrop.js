import { DRAGDROP_BEGIN_DRAG, DRAGDROP_END_DRAG, DRAGDROP_DO_DRAG } from 'actions/dragdrop'; 

const initialState = {
  isDragging: false,
  dragOrigin: {x: 0, y: 0},
  dragNode: {x: 0, y: 0},
  dragCard: null
};
export default function dragdrop(state = initialState, action) {
  switch (action.type) {
    case DRAGDROP_DO_DRAG:
      return Object.assign({}, state, {
        dragNode: action.mousePosition
      });

    case DRAGDROP_BEGIN_DRAG:
      return {
        isDragging: true,
        dragOrigin: { x: action.origin.offsetLeft, y: action.origin.offsetTop },
        dragNode: action.origin,
        dragCard: action.card
      }

    case DRAGDROP_END_DRAG:
      return Object.assign({}, initialState)

    default:
      return state;
  }
}
