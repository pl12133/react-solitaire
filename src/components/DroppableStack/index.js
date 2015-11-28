import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/'

import cardUtils from '/home/krirken/projects/react-solitaire/src/constants/cardUtils'
const DISPLAY_NAME = '<DroppableStack>';

const propTypes = {
  stackName: PropTypes.string.isRequired,
  index: PropTypes.number,
  distance: PropTypes.number,
  offsetLeft: PropTypes.number,
  handleBeginDragDrop: PropTypes.func.isRequired,
  getAvailableMoves: PropTypes.func.isRequired,
  moveCards: PropTypes.func.isRequired,
  flipCard: PropTypes.func.isRequired,
}

class DroppableStack extends Component {
  constructor(props) {
    super(props);
    let ownFuncs = [ "checkGoodDrop", "handleStackDrop", "handleAceDrop",
                     "handleMouseDown", "handleTouchStart", "handleDoubleClick" ];
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    })

    this.width = 75;
  }
  
  handleAceDrop(card) {
    let { name } = card;
    let numChildren = this.props.children.length;
    let cardValue = cardUtils.getCardValue(card);
    let cardSuit = cardUtils.getCardSuit(card);

    if (cardValue === (numChildren + 1)) {
      if (numChildren > 0) {
        let firstChild = this.props.children[0];
        let stackSuit = cardUtils.getCardSuit({name: firstChild.props.name});
        return (stackSuit === cardSuit)
      } else {
        return (cardValue === 1);
      }
    }

    return false;
  }
  handleStackDrop(card) {
    let { name } = card;
    let numChildren = this.props.children.length;
    let cardValue = cardUtils.getCardValue(card);
    let cardColor = cardUtils.getCardColor(card);

    if (numChildren > 0) {
      let { children } = this.props;
      let lastChild = children[children.length - 1];
      let stackCard = {name: lastChild.props.name};
      let stackValue = cardUtils.getCardValue(stackCard);
      let stackColor = cardUtils.getCardColor(stackCard);

      return ((stackColor !== cardColor) && (stackValue === (cardValue + 1)))
    } else {
      return (cardValue === 13)
    }
  }
  checkGoodDrop(card) {
    // This is called when there is a drop on this droppable from <Table>
    // return true to accept the drop, false to rejct it
    let { stackName } = this.props;
    if (stackName.indexOf('ACE') >= 0) {
      return this.handleAceDrop(card);
    }
    if (stackName.indexOf('STACK') >= 0) {
      return this.handleStackDrop(card);
    }
  }
  componentWillReceiveProps(nextProps) {
    // When receiving new props, if the facing card is face down,
    // then flip it over
    let { children: newChildren } = nextProps;
    let { children: oldChildren } = this.props;
    
    if ((newChildren.length > 0) && (newChildren.length < oldChildren.length)) {
      let lastChild = 'child-' + (newChildren.length-1);
      let child = this.refs[lastChild];
      if (child && child.isFlipped()) {
        let { stackName, flipCard } = this.props;
        flipCard({
          name: child.props.name,
          location: stackName,
          flipped: child.isFlipped()
        });
      }
    }

  }
  handleTouchStart(e, childIndex) {
    e.preventDefault();
    e.stopPropagation();
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseDown(touchObj, childIndex);
    }
  }
  handleMouseDown(e, childIndex) {
    let { children } = this.props;
    let stackBelowClicked = [];
    for (let index = childIndex, len = children.length; index < len; ++index) {
      let refName = 'child-' + index;
      stackBelowClicked.push(this.refs[refName]);
    }
    if (stackBelowClicked.length > 1) {
      let { handleBeginDragDrop } = this.props;
      handleBeginDragDrop(e, stackBelowClicked);
    } else if (stackBelowClicked.length === 1) {
      let clickedChild = stackBelowClicked[0];
      clickedChild.handleMouseDown(e);
    }
  }
  handleDoubleClick(e, childIndex) {
    e.preventDefault();
    let clickedCardName = e.target.id;
    let canMoveTo = this.props.getAvailableMoves(clickedCardName);
    let { children } = this.props;
    let stackBelowClicked = [];
    for (let index = childIndex, len = children.length; index < len; ++index) {
      let refName = 'child-' + index;
      let child = this.refs[refName];
      if (child.isFlipped())
        return;

      stackBelowClicked.push({
        name: child.props.name,
        flipped: false
      });
    }
    if (canMoveTo.length > 0) {
      let { moveCards } = this.props;
      moveCards(stackBelowClicked, canMoveTo[0]);
    }
  }
  render() {
    let { offsetLeft = 0, index = 1 } = this.props;
    index -= 1; 
    let offset = (index === 0) ?
                   offsetLeft : 
                   offsetLeft + index * (this.width + this.props.distance);
    let cardIndex = 0;
    let fnWrap = (fn, index) => {
      return (e) => {
        fn(e, index);
      }
    }
    let children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onMouseDown: fnWrap(this.handleMouseDown, cardIndex),
        onTouchStart: fnWrap(this.handleTouchStart, cardIndex),
        onDoubleClick: fnWrap(this.handleDoubleClick, cardIndex),
        ref: 'child-' + (cardIndex++)
      });
    });
    return (
      <div className={'droppable ' + styles}
           style={{left: offset + "px"}} >
        {children}
      </div>
    )
  }

}

DroppableStack.propTypes = propTypes;
export default DroppableStack;
