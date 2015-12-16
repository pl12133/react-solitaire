/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

/* TouchTap event injection */
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
//

/* Styles */
import styles from './styles/';
import buttonStyles from './styles/buttons';

/* Co-Components */
import DealArea from 'components/DealArea/';
import AceArea from 'components/AceArea/';
import Card from 'components/Card/';
import DroppableStack from 'components/DroppableStack/';

const DISPLAY_NAME = '<Table>';
const CARD_Y_DISTANCE = 15;
const propTypes = {
  // Two slices of state from redux
  dragdrop: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  // Dragdrop actionCreators
  beginDrag: PropTypes.func.isRequired,
  endDrag: PropTypes.func.isRequired,
  // Card actionCreators
  moveCards: PropTypes.func.isRequired,
  shuffleCards: PropTypes.func.isRequired,
  flipCard: PropTypes.func.isRequired,
  // redux-undo actionCreators
  undoMove: PropTypes.func.isRequired,
  redoMove: PropTypes.func.isRequired
};
class Table extends Component {
  constructor (props) {
    super(props);
    let ownFuncs = [ 'handleMouseUp', 'handleMouseMove',
                     'handleBeginDragDrop', 'handleEndDragDrop',
                     'handleCardFlip', 'handleResize', 'handleKeyUp',
                     'handleDealButtonClick', 'handleUndoButtonClick', 'handleRedoButtonClick',
                     'handleTouchEnd', 'handleTouchMove',
                     'getOffsetFromTable', 'getCardDimensions', 'getAvailableMoves',
                     'cardSlice', 'cardLocate', 'createRow', 'dealCards',
                     'checkGameWon', 'doWinAnimation',
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
    if (!elem || !elem.parentNode) {
      return {x: 0, y: 0};
    }
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
    this.setState({
      width: document.getElementById('table').clientWidth
    });
  }
  handleCardFlip (card) {
    let { flipCard } = this.props;
    flipCard(card);
  }
  handleRedoButtonClick (e) {
    let { redoMove } = this.props;
    redoMove();
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
    this.setState({
      redeal: true
    });
  }
  checkGameWon () {
    let { cards } = this.props;
    return cards.every((elem) => {
      return (elem.location.indexOf('ACE') >= 0);
    });
  }
  doWinAnimation () {
    let cards = [].slice.call(document.querySelectorAll('div[id*="-of-"]'));
    console.log('Wow you won!');
    let height = document.body.clientHeight;
    let moveAllOverAnimation = (card) => {
      let { offsetWidth, offsetHeight } = this.getCardDimensions();
      let { x, y } = this.getOffsetFromTable(card);
      let randomWithinWidth = Math.floor(Math.random() * this.state.width) - x - (offsetWidth / 2);
      let randomWithinHeight = Math.floor(Math.random() * height) - y - (offsetHeight / 2);
      card.style.left = randomWithinWidth + 'px';
      card.style.top = randomWithinHeight + 'px';

      card.style.transition = 'top 1s, left 1s';
    };
    let degrees = 90;
    let spinInCirclesAnimation = (card, index, arr) => {
      card.style.transform = 'rotate(' + degrees + 'deg)';
      card.style.transition = 'transform 2s';
      if (index === arr.length - 1) {
        degrees = (degrees >= 720)
          ? 0
          : degrees + 90;
      }
    };
    console.log(spinInCirclesAnimation);
//    let doAnimation = (arr) => {
//      let chance = Math.round(Math.random());
//      let anim;
//      switch (chance) {
//        case 0:
//          anim = spinInCirclesAnimation;
//          break;
//        case 1:
//          anim = moveAllOverAnimation;
//          break;
//      }
//      arr.forEach(anim);
//    };
    function debounce (func, wait, immediate) {
      let timeout;
      return function (...args) {
        let later = () => {
          timeout = null;
          func.apply(this, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
      };
    }
    let tableElem = document.getElementById('table');
    tableElem.style.overflow = 'visible';
    document.documentElement.style.overflow = 'hidden';

    let timeout = 2000;
    let useAnimation = moveAllOverAnimation;

    let step = debounce((timestamp) => {
      cards.forEach(useAnimation);
      window.requestAnimationFrame(step);
    }, timeout, true);
    window.requestAnimationFrame(step);
  }

  componentDidMount () {
    this.setState({
      redeal: true,
      width: document.getElementById('table').clientWidth
    });
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp (e) {
    if (e.ctrlKey && e.keyCode === 'Z'.charCodeAt(0)) {
      this.handleUndoButtonClick();
    } else if (e.ctrlKey && e.keyCode === 'Y'.charCodeAt(0)) {
      this.handleRedoButtonClick();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.redeal) {
      let { shuffleCards } = this.props;
      shuffleCards();
      this.setState({
        redeal: false
      });
    } else if (this.checkGameWon()) {
      this.doWinAnimation();
      alert('You Won!');
    }
  }
  getCardDimensions () {
    // 7.5% padding on left, 7.5% padding on right, 85% in the middle
    // cards should take up 11% of the table with 1.14% padding between
    const CARD_WIDTH = 222.77;
    const CARD_HEIGHT = 323.551;
    const ASPECT = CARD_HEIGHT / CARD_WIDTH;
    let { width } = this.state;
    let offsetWidth = Math.floor(width * 0.11);
    let offsetHeight = ASPECT * offsetWidth;
    return { offsetWidth, offsetHeight };
  }
  render () {
    // calculations
    let tableWidth = this.state.width || 800;
    let offsetLeft = parseInt(tableWidth * 0.075, 10);
    let { offsetWidth: droppableWidth, offsetHeight: droppableHeight } = this.getCardDimensions();
    let distanceBetweenStacks = parseInt(tableWidth * 0.0114, 10);

    // renderables
    let sevenDroppableStacks = this.createRow('STACK', 7, 0, CARD_Y_DISTANCE, distanceBetweenStacks, offsetLeft, droppableWidth, droppableHeight);
    let aceDroppableStacks = this.createRow('ACE', 4, 0, 0, distanceBetweenStacks / 4, offsetLeft / 2, droppableWidth, droppableHeight);
    let dealAreaFaceDownCards = this.cardSlice('DEAL-AREA-FACEDOWN', tableWidth * 0.004, 0, droppableWidth, droppableHeight);
    let dealAreaFaceUpCards = this.cardSlice('DEAL-AREA-FACEUP', 0, 0, droppableWidth, droppableHeight);
    let tableCards = this.cardSlice('TABLE');

    return (
      <div id={'table'} className={styles + ' ' + buttonStyles}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
                        onTouchMove={this.handleTouchMove}
                        onTouchEnd={this.handleTouchEnd} >
        <button type={'button'}
                className={'btn btn-sucess'}
                style={ {float: 'left'} }
                onClick={this.handleRedoButtonClick}>
          {'Redo!'}
        </button>
        <button type={'button'}
                className={'btn btn-sucess'}
                style={ {float: 'left'} }
                onClick={this.handleUndoButtonClick}>
          {'Undo!'}
        </button>
        <button type={'button'}
                className={'btn btn-sucess'}
                style={ {float: 'left'} }
                onClick={this.doWinAnimation}>
          {'Win!'}
        </button>
        <button type={'button'}
                className={'btn btn-primary'}
                style={ {float: 'right'} }
                onClick={this.handleDealButtonClick}>
          {'Deal!'}
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
