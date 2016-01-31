import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/';

import cardUtils from '../../constants/cardUtils';
const DISPLAY_NAME = '<DroppableStack>';

const propTypes = {
  stackName: PropTypes.string.isRequired,
  index: PropTypes.number,
  offsetWidth: PropTypes.number,
  offsetHeight: PropTypes.number,
  handleBeginDragDrop: PropTypes.func.isRequired,
  getAvailableMoves: PropTypes.func.isRequired,
  moveCards: PropTypes.func.isRequired,
  flipCard: PropTypes.func.isRequired
};

class DroppableStack extends Component {
  constructor (props) {
    super(props);
    let ownFuncs = [ 'checkGoodDrop', 'handleStackDrop', 'handleAceDrop', 'handleTouchTap',
                     'shouldComponentUpdate', 'handleMouseDown', 'handleTouchStart', 'handleDoubleClick' ];
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    });
  }

  handleAceDrop (card) {
    let numChildren = this.props.children.length;
    let cardValue = cardUtils.getCardValue(card);
    let cardSuit = cardUtils.getCardSuit(card);

    if (cardValue === (numChildren + 1)) {
      if (numChildren > 0) {
        let firstChild = this.props.children[0];
        let stackSuit = cardUtils.getCardSuit({name: firstChild.props.name});
        return (stackSuit === cardSuit);
      } else {
        return (cardValue === 1);
      }
    }

    return false;
  }
  handleStackDrop (card) {
    let numChildren = this.props.children.length;
    let cardValue = cardUtils.getCardValue(card);
    let cardColor = cardUtils.getCardColor(card);

    if (numChildren > 0) {
      let { children } = this.props;
      let lastChild = children[children.length - 1];
      let stackCard = {name: lastChild.props.name};
      let stackValue = cardUtils.getCardValue(stackCard);
      let stackColor = cardUtils.getCardColor(stackCard);

      return ((stackColor !== cardColor) && (stackValue === (cardValue + 1)));
    } else {
      return (cardValue === 13);
    }
  }
  checkGoodDrop (cards, numCards) {
    // This is called when there is a drop on this droppable from <Table>
    // return true to accept the drop, false to rejct it
    let { stackName } = this.props;
    if (stackName.indexOf('ACE') >= 0) {
      if (numCards > 1) {
        return false;
      }

      return this.handleAceDrop(cards);
    }
    if (stackName.indexOf('STACK') >= 0) {
      return this.handleStackDrop(cards);
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    let { children: oldChildren } = this.props;
    let { children: newChildren } = nextProps;
    return ((oldChildren.length !== newChildren.length) || (this.props.offsetWidth !== nextProps.offsetWidth) || (oldChildren[oldChildren.length - 1] !== newChildren[newChildren.length - 1]));
  }
  componentWillReceiveProps (nextProps) {
    // When receiving new props, if the facing card is face down,
    // then flip it over
    let { children: newChildren } = nextProps;
    let { children: oldChildren } = this.props;

    if ((newChildren.length > 0) && (newChildren.length < oldChildren.length)) {
      let lastChild = 'child-' + (newChildren.length - 1);
      let child = this.refs[lastChild];
      if (child && child.props.flipped) {
        let { flipped, name } = child.props;
        let { stackName, flipCard } = this.props;
        flipCard({
          name,
          flipped,
          location: stackName
        });
      }
    }
  }
  handleTouchStart (e, childIndex) {
    e.preventDefault();
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseDown(touchObj, childIndex);
    }
  }
  handleMouseDown (e, childIndex) {
    let { children } = this.props;
    let stackBelowClicked = [];
    for (let index = childIndex, len = children.length; index < len; ++index) {
      let refName = 'child-' + index;
      stackBelowClicked.push(this.refs[refName]);
    }
    if (stackBelowClicked.length) {
      let { handleBeginDragDrop } = this.props;
      handleBeginDragDrop(e, stackBelowClicked);
    }
  }
  handleTouchTap (e, childIndex) {
    e.preventDefault();
    this.handleDoubleClick(e, childIndex);
  }
  handleDoubleClick (e, childIndex) {
    e.preventDefault();
    let clickedCardName = e.target.id;
    let { children } = this.props;
    let numCardsBelowClicked = children.length - childIndex;
    let canMoveTo = this.props.getAvailableMoves(clickedCardName, numCardsBelowClicked);
    let stackBelowClicked = [];
    for (let index = childIndex, len = children.length; index < len; ++index) {
      let refName = 'child-' + index;
      let child = this.refs[refName];
      let { flipped, name } = child.props;
      if (flipped) {
        return;
      }

      stackBelowClicked.push({
        name,
        flipped: false
      });
    }
    if (canMoveTo.length) {
      let { moveCards } = this.props;
      moveCards(stackBelowClicked, canMoveTo[0]);
    }
  }
  render () {
    let { index = 1, stackName, offsetHeight, offsetWidth } = this.props;
    index -= 1;

    let cardIndex = 0;
    let fnWrap = (fn, index) => {
      return (e) => {
        fn(e, index);
      };
    };
    let children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onMouseDown: fnWrap(this.handleMouseDown, cardIndex),
        onTouchStart: fnWrap(this.handleTouchStart, cardIndex),
        onDoubleClick: fnWrap(this.handleDoubleClick, cardIndex),
        onTouchTap: fnWrap(this.handleTouchTap, cardIndex),
        ref: 'child-' + (cardIndex++)
      });
    });
    let numChildren = children.length;

    if (stackName.indexOf('STACK') >= 0) {
      offsetHeight += (numChildren > 2) ? (numChildren - 2) * 15 : 0;
    }
    return (
      <div className={'droppable ' + styles}
           style={{height: offsetHeight + 'px',
                   width: offsetWidth + 'px' }} >
        {children}
      </div>
    );
  }

}

DroppableStack.propTypes = propTypes;
export default DroppableStack;
