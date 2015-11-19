import React, { Component, PropTypes } from 'react';

/* Styles */
import styles from './styles/'

/* Co-Components */


import DealArea from '/home/krirken/projects/react-solitair/src/components/DealArea/'
import AceArea from '/home/krirken/projects/react-solitair/src/components/AceArea/'
import Card from '/home/krirken/projects/react-solitair/src/components/Card/'
import DroppableStack from '/home/krirken/projects/react-solitair/src/components/DroppableStack/'

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
                     "createRow", "dealCards",
                     "render" ]

    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error("Attempt to self-bind \'" + elem + "\' to <Table> failed");
        return;
      }
      this[elem] = this[elem].bind(this);
    })
  }

  getOffsetFromTable(elem) {
    let offset = {x: 0, y: 0};
    for (let node = elem.parentNode; node.id !== 'table'; node = node.parentNode) {
      offset.x += node.offsetLeft;
      offset.y += node.offsetTop;
    }
    return offset;
  }
  handleMouseDown(e) {
    
  }
  handleMouseUp(e) {
    let { isDragging } = this.props.dragdrop;
    if (isDragging)
      this.handleEndDragDrop(e);
  }

  handleBeginDragDrop(e, card) {
    let { isDragging } = this.props.dragdrop;
    let isFlipped = card.isFlipped(); // Don't drag face down cards
    if (!isDragging && !isFlipped) {
      let { beginDrag } = this.props;
      beginDrag(card);
    }
  }
  handleEndDragDrop(e) {
    let { endDrag, dragdrop } = this.props;
    let { dragNode, dragCard } = dragdrop;
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
          let dropCard = {
            name: dragCard.props.name,
            flipped: false
          }
          if (droppedOn.checkGoodDrop(dropCard)) {
            //Successful drop!
            let { moveCard } = this.props;
            moveCard(dropCard, toStack);
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
      let { dragOrigin } = dragdrop;
      dragNode.style.left = dragOrigin.x;
      dragNode.style.top = dragOrigin.y;
    }

    dragNode.style.zIndex = '10';
    endDrag(dragNode);
  }

  handleMouseMove(e) {
    let { isDragging, dragNode } = this.props.dragdrop;
    if (isDragging) {
      let { clientX, clientY } = e;
      let offset = this.getOffsetFromTable(dragNode);
      let elemLeft = clientX - offset.x;
      let elemTop = clientY - offset.y;
      let off = { x: elemLeft - (dragNode.offsetWidth / 2),
                  y: elemTop - (dragNode.offsetHeight / 2)};
      dragNode.style.left = off.x + 'px';
      dragNode.style.top =  off.y + 'px';
      
      // Dragging Card should appear above everything else
      dragNode.style.zIndex = '100';
    }
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
                        ref={stackName}>
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
    let { moveCard, cards } = this.props;
    let count = 0;
    for (let index = 1; index <= 7; ++index) {
      for (let innerIndex = index; innerIndex <= 7; ++innerIndex) {
        let card = cards[count++];
        if (innerIndex === index)
          card.flipped = false;

        moveCard(card, 'STACK-' + innerIndex);
      }
    }
    while (count < cards.length) {
      let card = cards[count++];
      //card.flipped = false;
      moveCard(card, 'DEAL-AREA-FACEDOWN');
    }
  }

  componentDidMount() {
    this.dealCards();
  }

  render() {
    let sevenDroppableStacks = this.createRow('STACK', 7, 0, 15, 65, 140);
    let aceDroppableStacks = this.createRow('ACE', 4, 0, 5, 20, 40);
    let dealAreaFaceDownCards = this.cardSlice('DEAL-AREA-FACEDOWN', 4, 0);
    let dealAreaFaceUpCards = this.cardSlice('DEAL-AREA-FACEUP', 4, 0);
    
    let tableCards = this.cardSlice('TABLE');

    return (
      <div id={'table'} className={styles}
                        onMouseMove={this.handleMouseMove} 
                        onMouseUp={this.handleMouseUp} >
        {'One day I will be a table'}
        <DealArea moveCard={this.props.moveCard}
                  faceUp={dealAreaFaceUpCards}
                  faceDown={dealAreaFaceDownCards}>
        </DealArea>

        <AceArea>
          {aceDroppableStacks}
        </AceArea>

        {sevenDroppableStacks}
        {/*dealAreaFaceUpCards*/}

      </div>
    )
  }
}

Table.propTypes = propTypes;

export default Table;
