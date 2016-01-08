import { DRAGDROP_BEGIN_DRAG, DRAGDROP_END_DRAG } from 'actions/dragdrop';

const initialState = {
  isDragging: false,
  dragOrigins: [],
  dragNodes: [],
  dragCards: []
};
export default function dragdrop (state = initialState, action) {
  switch (action.type) {
    case DRAGDROP_BEGIN_DRAG: {
      let dragOrigins = action.origins.map((elem) => {
        return { x: elem.offsetLeft,
                 y: elem.offsetTop };
      });
      return {
        isDragging: true,
        dragOrigins,
        dragNodes: action.origins,
        dragCards: action.cards
      };
    }

    case DRAGDROP_END_DRAG: {
      return initialState;
    }
    default:
      return state;
  }
}
