import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/';

/* Co-Components */
import Card from 'components/Card/'

class Deck extends Component {
  constructor(props) {
    super(props)
    this.buildDeck = this.buildDeck.bind(this);
  }

  buildDeck() {
    // deck only generates once
    let memo = [];
    let initDeck = () => {
      if (memo.length)
        return memo;

      const suits = ['hearts', 'diamonds', 'clubs', 'spades']
      const values = ['two', 'three', 'four', 'five', 'six', 'seven',
                    'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace']

      suits.forEach((suit) => {
        values.forEach((value) => {
          let str = value + '-of-' + suit;
          memo.push(
            <Card {...this.props} key={str} name={str} />
          )
        })
      })

      return memo;
    }
    return initDeck();
  }
  render() {
    let children = this.buildDeck();

    return (
      <div id={'js-deck'} className={styles}>
        {children}
      </div>
    )
  }

}

export default Deck;
