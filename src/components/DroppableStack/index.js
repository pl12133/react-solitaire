import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/'

class DroppableStack extends Component {
  constructor(props) {
    super(props);
    let ownFuncs = [ "checkGoodDrop", "handleStackDrop", "handleAceDrop",
                     "getCardColor", "getCardValue", "getCardSuit" ]
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error("Attempt to self-bind \'" + elem + "\' to <DroppableStack> failed");
        return;
      }
      this[elem] = this[elem].bind(this);
    })

    this.width = 75;
  }
  
  getCardSuit(card) {
    let { name } = card;
    let suit = name.substr(name.lastIndexOf('-') + 1);
    return suit;

  }
  getCardColor(card) {
    let { name } = card;
    let suit = name.substr(name.lastIndexOf('-') + 1);
    switch (suit) {
      case 'hearts':
      case 'diamonds':
        return 'red';
      case 'spades':
      case 'clubs':
        return 'black';

      default:
        return 'blank';
    }
//    if ((card.name.indexOf('hearts') >= 0) || (card.name.indexOf('diamonds') >= 0))
//      return 'red';
//
//    if ((card.name.indexOf('spades') >= 0) || (card.name.indexOf('clubs') >= 0))
//      return 'black'
  }
  getCardValue(card) {
    let { name } = card;
    let value = name.substr(0, name.indexOf('-'))
    //console.log(`Getting Card Value of ${name}: ${value}`);
    switch (value) {
      case 'ace':
        return 1;
      case 'two':
        return 2;
      case 'three':
        return 3;
      case 'four':
        return 4;
      case 'five':
        return 5;
      case 'six':
        return 6;
      case 'seven':
        return 7;
      case 'eight':
        return 8;
      case 'nine':
        return 9;
      case 'ten':
        return 10;
      case 'jack':
        return 11;
      case 'queen':
        return 12;
      case 'king':
        return 13;
        
       default:
        return -1;
    }
  }
  handleAceDrop(card) {
    let { name } = card;
    let numChildren = this.props.children.length;
    let [cardValue, cardSuit, cardColor] = [this.getCardValue(card), this.getCardSuit(card), this.getCardColor(card)]

    console.log(`!ACE DROP! Value of ${name} = ${cardValue} and ${cardSuit}`);
    if (cardValue === (numChildren + 1)) {
      if (numChildren > 0) {
        let firstChild = this.props.children[0];
        let stackSuit = this.getCardSuit({name: firstChild.props.name});
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
    let [cardValue, cardSuit, cardColor] = [this.getCardValue(card), this.getCardSuit(card), this.getCardColor(card)]

    console.log(`!STACK DROP! Value of ${name} = ${cardValue} and ${cardColor}`);

    return true;
  }
  checkGoodDrop(card) {
    // This is called when there is a drop on this droppable from <Table>
    let { stackName } = this.props;
    if (stackName.indexOf('ACE') >= 0) {
      //console.log('Dropping to Ace Stack')
      return this.handleAceDrop(card);
    }
    if (stackName.indexOf('STACK') >= 0) {
      //console.log('Dropping to Play Stack')
      return this.handleStackDrop(card);
    }
  }
  componentWillReceiveProps(nextProps) {
    //console.log("New Children: ", nextProps.children[nextProps.children.length - 1]);

  }

  render() {
    let { offsetLeft = 0, index = 1 } = this.props;
    index -= 1; 
    let offset = (index === 0) ?
                   offsetLeft : 
                   offsetLeft + index * (this.width + this.props.distance);
    return (
      <div className={'droppable ' + styles}
           style={{left: offset + "px"}} >
        {this.props.children}
      </div>
    )
  }

}

DroppableStack.propTypes = {
  index: PropTypes.number,
  distance: PropTypes.number,
  offsetLeft: PropTypes.number
}
export default DroppableStack;
