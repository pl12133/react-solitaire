import React, { Component, PropTypes } from 'react';

/* Styles */
import styles from './styles/'

/* Co-Components */


import DealArea from '/home/krirken/projects/react-solitair/src/components/DealArea/'
import AceArea from '/home/krirken/projects/react-solitair/src/components/AceArea/'
import Card from '/home/krirken/projects/react-solitair/src/components/Card/'
import DroppableStack from '/home/krirken/projects/react-solitair/src/components/DroppableStack/'

const DISPLAY_NAME = '<Table>';
const CARD_Y_DISTANCE = 15;
const propTypes = {
  dragdrop: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  beginDrag: PropTypes.func.isRequired,
  endDrag: PropTypes.func.isRequired,
  moveCard: PropTypes.func.isRequired
}
class Table extends Component {
  constructor(props) {
    super(props);
    let ownFuncs = [ "handleMouseUp", "handleMouseMove",
                     "handleEndDragDrop", "handleBeginDragDrop", 
                     "getOffsetFromTable", "cardSlice", "cardLocate",
                     "createRow", "dealCards", "handleButtonClick",
                     "handleTouchEnd", "handleTouchMove",
                     "handleCardFlip", 
                     "render" ]

    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    });
    this.state = { redeal: false };
  }

  getOffsetFromTable(elem) {
    let offset = {x: 0, y: 0};
    for (let node = elem.parentNode; node.id !== 'table'; node = node.parentNode) {
      offset.x += node.offsetLeft;
      offset.y += node.offsetTop;
    }
    return offset;
  }
  handleButtonClick(e) {
    this.dealCards();
    console.log('Deal Button Clicked');
  }
  handleMouseUp(e) {
    let { isDragging } = this.props.dragdrop;
    if (isDragging)
      this.handleEndDragDrop(e);
  }
  
  handleTouchMove(e) {
    console.log('Touch Moving');
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseMove(touchObj);
    }
  }
  handleTouchEnd(e) {
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseUp(touchObj);
    }
  }
  handleBeginDragDrop(e, cards) {
    let { isDragging } = this.props.dragdrop;
    if (!cards || !Array.isArray(cards)) {
      console.error('Invalid Cards Array! ', cards);
      return;
    }
    let isFlipped = cards[0].isFlipped(); // Don't drag face down cards
    if (!isDragging && !isFlipped) {
      let { beginDrag } = this.props;
      beginDrag(cards);
    }
  }
  handleEndDragDrop(e) {
    let { endDrag, dragdrop } = this.props;
    let { dragNodes, dragCards } = dragdrop;
    let { clientX, clientY } = e;
    let tableDroppables = [].slice.call(document.querySelectorAll('#table > .droppable'));
    let aceDroppables = [].slice.call(document.querySelectorAll('#aceArea > .droppable'));

    function pointInsideRect(rX, rY, width, height, ptX, ptY) {
      let left = rX, right = rX + width, top = rY, bottom = rY + height;
      return (((left < ptX) && (ptX < right)) && ((top < ptY) && (ptY < bottom)))
    }
    let dropCheck = (stackName) => {
      return (elem, index) => {
        // Check for a successful drop
        let offset = this.getOffsetFromTable(elem);
        let left = elem.offsetLeft + offset.x;
        let top = elem.offsetTop + offset.y;
        if (pointInsideRect(left, top,
                            elem.offsetWidth, elem.offsetHeight,
                            clientX, clientY)) {
          // Collision, check if drop is acceptable
          let toStack = stackName + '-' + (index+1);
          let droppedOn = this.refs[toStack];
          let testCard = {
            name: dragCards[0].props.name,
            flipped: false
          }
          if (droppedOn.checkGoodDrop(testCard)) {
            //Successful drop!
            let { moveCard } = this.props;
            dragCards.forEach((card) => {
              let dropCard = {
                name: card.props.name,
                flipped: false
              }
              moveCard(dropCard, toStack);
            });
            return true;
          }
          return false;
        }
        return false;
      }
    }

    //console.log("Drop Target: (" + clientX + ", " + clientY + ")");
    let dropped = tableDroppables.some(dropCheck('STACK')) ||
                  aceDroppables.some(dropCheck('ACE'));

    if (!dropped) {
      // Snap back if not dropped
      //console.log("Not Dropped");
      let { dragOrigins } = dragdrop;
      dragNodes.forEach((node, index) => {
        node.style.left = dragOrigins[index].x;
        node.style.top = dragOrigins[index].y;
      });
    }

    dragNodes.forEach((node, index) => {
      node.style.zIndex = '10';
    });

    endDrag();
  }

  handleMouseMove(e) {
    let { isDragging, dragNodes } = this.props.dragdrop;
    if (isDragging) {
      let { clientX, clientY } = e;
      dragNodes.forEach((node,index) => {
        let offset = this.getOffsetFromTable(node);
        let elemLeft = clientX - offset.x;
        let elemTop = clientY - offset.y;
        let off = { x: elemLeft - (node.offsetWidth / 2),
                    y: (elemTop - (node.offsetHeight / 2)) + index * CARD_Y_DISTANCE};
        node.style.left = off.x + 'px';
        node.style.top =  off.y + 'px';
        
        // Dragging Card should appear above everything else
        node.style.zIndex = '' + (100+index);
      });
    }
  }

  handleCardFlip(card) {
    let { flipCard } = this.props;
    flipCard(card)
  }
  createRow(namePrefix, numCols, cardsXOffset, cardsYOffset, stackDistance, offsetLeft) {
    let row = [];
    for (let index = 0; index < numCols; ++index) {
      let stackName = namePrefix + '-' + (index+1);
      let stackChildren = this.cardSlice(stackName, cardsXOffset, cardsYOffset);
      row.push(
        <DroppableStack key={stackName}
                        stackName={stackName}
                        index={index+1}
                        distance={stackDistance}
                        offsetLeft={offsetLeft}
                        ref={stackName}
                        handleBeginDragDrop={this.handleBeginDragDrop}
                        flipCard={this.handleCardFlip}>
          {stackChildren}
        </DroppableStack>
      )
    }
    return row;
  }

  cardLocate(location) {
    function locationFilter(location) {
      return function(elem) {
        return (elem.location === location);
      }
    }
    return locationFilter(location);
  }

  cardSlice(location, offsetX = 0, offsetY = 0) {
    let cardMap = (offsetWidth = 0, offsetHeight = 0) => {
      return (card, index) => {
        //console.log(index + ": " + card.name + " Flipped? " + card.flipped);
        return <Card isDragging={this.props.dragdrop.isDragging}
                     handleBeginDragDrop={this.handleBeginDragDrop}
                     offsetY={index*offsetHeight}
                     offsetX={index*offsetWidth}
                     flipped={card.flipped}
                     key={card.name}
                     name={card.name} />
      }
    }
    let { cards } = this.props;
    return cards
      .filter(this.cardLocate(location))
      .map(cardMap(offsetX, offsetY));
  }

  dealCards() {
    this.props.shuffleCards();
    this.setState({ redeal: true });
  }

  componentDidMount() {
    this.dealCards();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.redeal) {
      let { moveCard, cards } = this.props;
      let count = 0;
      for (let index = 1; index <= 7; ++index) {
        for (let innerIndex = index; innerIndex <= 7; ++innerIndex) {
          let card = cards[count++];
          card.flipped = (innerIndex !== index);
          moveCard(card, 'STACK-' + innerIndex);
        }
      }
      while (count < cards.length) {
        let card = cards[count++];
        card.flipped = true;
        moveCard(card, 'DEAL-AREA-FACEDOWN');
      }
      this.setState({ redeal: false });
    }
  }
  render() {
    let sevenDroppableStacks = this.createRow('STACK', 7, 0, CARD_Y_DISTANCE, 65, 140);
    let aceDroppableStacks = this.createRow('ACE', 4, 0, 0, 20, 40);
    let dealAreaFaceDownCards = this.cardSlice('DEAL-AREA-FACEDOWN', 4, 0);
    let dealAreaFaceUpCards = this.cardSlice('DEAL-AREA-FACEUP', 4, 0);
    let tableCards = this.cardSlice('TABLE');
    let allAceChildren = this.props.cards.filter((elem) => {
      if (!elem) return false;
      return (elem.location.indexOf('ACE') >= 0);
    });

    if (allAceChildren.length === 52) {
      alert('You Win!!');
    }

    return (
      <div id={'table'} className={styles}
                        onMouseMove={this.handleMouseMove} 
                        onMouseUp={this.handleMouseUp}
                        onTouchMove={this.handleTouchMove}
                        onTouchEnd={this.handleTouchEnd} >
        <button type={'button'}
                onClick={this.handleButtonClick}>
          {'Deal!'}
        </button>
        <DealArea moveCard={this.props.moveCard}
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
    )
  }
}

Table.propTypes = propTypes;

export default Table;
