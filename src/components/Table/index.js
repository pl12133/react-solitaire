/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

/* TouchTap event injection */
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
//

/* Styles */
import styles from './styles/';

/* Co-Components */
import DealArea from 'components/DealArea/';
import AceArea from 'components/AceArea/';
import Card from 'components/Card/';
import DroppableStack from 'components/DroppableStack/';

const DISPLAY_NAME = '<Table>';
const CARD_Y_DISTANCE = 15;
const propTypes = {
  dragdrop: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  beginDrag: PropTypes.func.isRequired,
  endDrag: PropTypes.func.isRequired,
  moveCards: PropTypes.func.isRequired
};
class Table extends Component {
  constructor (props) {
    super(props);
    let ownFuncs = [ 'handleMouseUp', 'handleMouseMove',
                     'handleEndDragDrop', 'handleBeginDragDrop',
                     'getOffsetFromTable', 'cardSlice', 'cardLocate',
                     'createRow', 'dealCards',
                     'handleTouchEnd', 'handleTouchMove',
                     'handleDealButtonClick', 'handleUndoButtonClick',
                     'handleCardFlip', 'handleResize',
                     'getAvailableMoves', 'getCardDimensions', 'checkGameWon',
                     'render' ];

    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    });

    this.state = { redeal: false };
  }

  getOffsetFromTable (elem) {
    let tableElem = document.getElementById('table');
    let offset = { x: tableElem.offsetLeft - tableElem.scrollLeft,
                   y: tableElem.offsetTop - tableElem.scrollTop };
    for (let node = elem.parentNode; node.id !== 'table'; node = node.parentNode) {
      offset.x += node.offsetLeft;
      offset.y += node.offsetTop;
    }
    return offset;
  }

  getAvailableMoves (cardName, numCards) {
    return Object.keys(this.refs).filter((key, index) => {
      let stack = this.refs[key];
      return stack.checkGoodDrop({name: cardName}, numCards);
    });
  }
  handleResize (e) {
    const DEBUG_DISPLAY_DEVICE_SIZE = false;
    if (DEBUG_DISPLAY_DEVICE_SIZE) {
      let width = document.body.clientWidth;
      let height = document.body.clientHeight;
      alert(`(height x width): ${height} x ${width}`);
    }
    this.setState(Object.assign({}, this.state, {
      width: document.getElementById('table').clientWidth
    }));
  }
  handleUndoButtonClick (e) {
    let { undoMove } = this.props;
    undoMove();
  }
  handleDealButtonClick (e) {
    this.dealCards();
  }
  handleMouseUp (e) {
    let { isDragging } = this.props.dragdrop;
    if (isDragging) {
      this.handleEndDragDrop(e);
    }
  }

  handleTouchMove (e) {
    let { isDragging } = this.props.dragdrop;
    if (isDragging) {
      e.preventDefault();
      let touchObj = e.changedTouches[0];
      if (touchObj) {
        this.handleMouseMove(touchObj);
      }
    }
  }
  handleTouchEnd (e) {
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseUp(touchObj);
    }
  }
  handleBeginDragDrop (e, cards) {
    let { isDragging } = this.props.dragdrop;
    if (!cards || !Array.isArray(cards)) {
      console.error('Invalid Cards Array! ', cards);
      return;
    }
    let isFlipped = cards[0].props.flipped; // Don't drag face down cards
    if (!isDragging && !isFlipped) {
      let { beginDrag } = this.props;
      beginDrag(cards);
    }
  }
  handleEndDragDrop (e) {
    let { endDrag, dragdrop } = this.props;
    let { dragNodes, dragCards } = dragdrop;
    let { pageX, pageY } = e;
    let tableDroppables = [].slice.call(document.querySelectorAll('#table > .droppable'));
    let aceDroppables = [].slice.call(document.querySelectorAll('#aceArea > .droppable'));

    function pointInsideRect (rX, rY, width, height, ptX, ptY) {
      let left = rX;
      let right = rX + width;
      let top = rY;
      let bottom = rY + height;
      return (((left < ptX) && (ptX < right)) && ((top < ptY) && (ptY < bottom)));
    }
    let dropCheck = (stackName) => {
      return (elem, index) => {
        // Check for a successful drop
        let offset = this.getOffsetFromTable(elem);
        let left = elem.offsetLeft + offset.x;
        let top = elem.offsetTop + offset.y;
        if (pointInsideRect(left, top,
                            elem.offsetWidth, elem.offsetHeight,
                            pageX, pageY)) {
          // Collision, check if drop is acceptable
          let toStack = stackName + '-' + (index + 1);
          let droppedOn = this.refs[toStack];
          let testCard = {
            name: dragCards[0].props.name,
            flipped: false
          };
          if (droppedOn.checkGoodDrop(testCard, dragCards.length)) {
            // Successful drop!
            let { moveCards } = this.props;
            let toMove = dragCards.map((card) => {
              let dropCard = {
                name: card.props.name,
                flipped: false
              };
              return dropCard;
            });
            moveCards(toMove, toStack);
            return true;
          }
          return false;
        }
        return false;
      };
    };
    let dropped = tableDroppables.some(dropCheck('STACK')) ||
                  aceDroppables.some(dropCheck('ACE'));

    if (!dropped) {
      // Snap back if not dropped
      let { dragOrigins } = dragdrop;
      dragNodes.forEach((node, index) => {
        node.style.left = dragOrigins[index].x + 'px';
        node.style.top = dragOrigins[index].y + 'px';
      });
    }

    dragNodes.forEach((node, index) => {
      node.style.zIndex = '10';
    });

    endDrag();
  }

  handleMouseMove (e) {
    let { isDragging, dragNodes } = this.props.dragdrop;
    if (isDragging) {
      let { pageX, pageY } = e;
      dragNodes.forEach((node, index) => {
        let offset = this.getOffsetFromTable(node);
        let elemLeft = pageX - offset.x;
        let elemTop = pageY - offset.y;
        let off = { x: elemLeft - (node.offsetWidth / 2),
                    y: (elemTop - (node.offsetHeight / 2)) + index * CARD_Y_DISTANCE};
        node.style.left = off.x + 'px';
        node.style.top = off.y + 'px';

        // Dragging Card should appear above everything else
        node.style.zIndex = '' + (100 + index);
      });
    }
  }

  handleCardFlip (card) {
    let { flipCard } = this.props;
    flipCard(card);
  }
  createRow (namePrefix, numCols, cardsXOffset, cardsYOffset, stackDistance, offsetLeft, offsetWidth, offsetHeight) {
    let row = [];
    for (let index = 0; index < numCols; ++index) {
      let stackName = namePrefix + '-' + (index + 1);
      let stackChildren = this.cardSlice(stackName, cardsXOffset, cardsYOffset, offsetWidth, offsetHeight);
      row.push(
        <DroppableStack key={stackName}
                        stackName={stackName}
                        index={index + 1}
                        distance={stackDistance}
                        offsetLeft={offsetLeft}
                        offsetWidth={offsetWidth}
                        offsetHeight={offsetHeight}
                        ref={stackName}
                        handleBeginDragDrop={this.handleBeginDragDrop}
                        getAvailableMoves={this.getAvailableMoves}
                        moveCards={this.props.moveCards}
                        flipCard={this.handleCardFlip}>
          {stackChildren}
        </DroppableStack>
      );
    }
    return row;
  }

  cardLocate (location) {
    function locationFilter (location) {
      return function (elem) {
        return (elem.location === location);
      };
    }
    return locationFilter(location);
  }

  cardSlice (location, offsetLeft = 0, offsetTop = 0, offsetWidth = 0, offsetHeight = 0) {
    let cardMap = (offsetLeft = 0, offsetTop = 0, offsetWidth = 0, offsetHeight = 0) => {
      return (card, index) => {
        return <Card isDragging={this.props.dragdrop.isDragging}
                     handleBeginDragDrop={this.handleBeginDragDrop}
                     offsetLeft={index * offsetLeft}
                     offsetTop={index * offsetTop}
                     offsetWidth={offsetWidth}
                     offsetHeight={offsetHeight}
                     flipped={card.flipped}
                     key={card.name}
                     name={card.name} />;
      };
    };
    let { cards } = this.props;
    return cards
      .filter(this.cardLocate(location))
      .map(cardMap(offsetLeft, offsetTop, offsetWidth, offsetHeight));
  }

  dealCards () {
    // Emit a dummy moveCards action so that UNDO can undo a shuffle.
    // UNDO_ACTION does not work as planned here
    let { moveCards, cards } = this.props;
    let dummyCard = cards[cards.length - 1];
    moveCards([dummyCard], dummyCard.location);
    this.setState({
      redeal: true,
      width: this.state.width
    });
  }
  checkGameWon () {
    let { cards } = this.props;
    let allAceChildren = cards.filter((elem) => {
      if (!elem) return false;
      return (elem.location.indexOf('ACE') >= 0);
    });
    return (allAceChildren.length === 52);
  }

  componentDidMount () {
    this.setState({
      redeal: true,
      width: document.getElementById('table').clientWidth
    });
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.checkGameWon()) {
      alert('You Won!');
    }
    if (this.state.redeal) {
      let { shuffleCards } = this.props;
      shuffleCards();
      this.setState(Object.assign({}, this.state, {
        redeal: false
      }));
    }
  }
  getCardDimensions (tableWidth) {
    const CARD_WIDTH = 222.77;
    const CARD_HEIGHT = 323.551;
    // const ASPECT = CARD_WIDTH / CARD_HEIGHT;
    const SCALE_TEST = Math.floor(tableWidth / 100);
    let scale;
    switch (SCALE_TEST) {
      case 18:
        scale = 2 / 3;
        break;
      case 17:
      case 16:
      case 15:
      case 14:
        scale = 1 / 2;
        break;
      case 13:
      case 12:
      case 11:
      case 10:
        scale = 1 / 2;
        break;
      case 9:
      case 8:
        scale = 1 / 3;
        break;
      case 7:
      case 6:
      case 5:
        scale = 1 / 4;
        break;
      case 4:
      case 3:
        scale = 1 / 5;
        break;

      default:
        scale = 1 / 2;
        break;
    }
    let offsetWidth = CARD_WIDTH * scale;
    let offsetHeight = CARD_HEIGHT * scale;

    return { offsetWidth, offsetHeight };
  }
  render () {
    // calculations
    let tableWidth = this.state.width || 800;
    let offsetLeft = parseInt(tableWidth * 0.08, 10);
    let { offsetWidth: droppableWidth, offsetHeight: droppableHeight } = this.getCardDimensions(tableWidth);
    let distanceBetweenStacks = parseInt(tableWidth * 0.03, 10);

    // renderables
    let sevenDroppableStacks = this.createRow('STACK', 7, 0, CARD_Y_DISTANCE, distanceBetweenStacks, offsetLeft, droppableWidth, droppableHeight);
    let aceDroppableStacks = this.createRow('ACE', 4, 0, 0, distanceBetweenStacks / 4, offsetLeft / 2, droppableWidth, droppableHeight);
    let dealAreaFaceDownCards = this.cardSlice('DEAL-AREA-FACEDOWN', 4, 0, droppableWidth, droppableHeight);
    let dealAreaFaceUpCards = this.cardSlice('DEAL-AREA-FACEUP', 4, 0, droppableWidth, droppableHeight);
    let tableCards = this.cardSlice('TABLE');

    return (
      <div id={'table'} className={styles}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
                        onTouchMove={this.handleTouchMove}
                        onTouchEnd={this.handleTouchEnd} >
        <button type={'button'}
                onClick={this.handleDealButtonClick}>
          {'Deal!'}
        </button>
        <button type={'button'}
                onClick={this.handleUndoButtonClick}>
          {'Undo!'}
        </button>
        <DealArea moveCards={this.props.moveCards}
                  getAvailableMoves={this.getAvailableMoves}
                  offsetWidth={droppableWidth}
                  offsetHeight={droppableHeight}
                  faceUp={dealAreaFaceUpCards}
                  faceDown={dealAreaFaceDownCards}>
        </DealArea>

        <AceArea>
          {aceDroppableStacks}
        </AceArea>

        {sevenDroppableStacks}

        {/* tableCards are rendered for testing */}
        {tableCards}

      </div>
    );
  }
}

Table.propTypes = propTypes;

export default Table;
