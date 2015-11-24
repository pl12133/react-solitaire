import React, {Component, PropTypes } from 'react';
import styles from './styles'

const DISPLAY_NAME = '<DealArea>';

class DealArea extends Component {
  constructor(props) {
    super(props)
    let ownFuncs = [ "componentWillReceiveProps", "handleMouseDown",
                     "handleTouchStart", "render" ];
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    })
  }
  componentWillReceiveProps(nextProps) {
  }
  handleMouseDown(e) {
    // Called when the top <Card> of <DealArea> is clicked
    let { faceDown: children } = this.props;
    let childRefName = 'child-' + (children.length-1);
    let lastChild = this.refs[childRefName];
    if (!lastChild) {
      let { moveCard, faceUp } = this.props;
      faceUp.reverse().forEach((elem) => {
        let { name } = elem.props;
        let card = {
          name,
          flipped: true,
        }
        moveCard(card, 'DEAL-AREA-FACEDOWN');
      });
      return;
    }
    if (lastChild.isFlipped()) {
      // If the card is face down, flip the top three cards off the stack and move to FACEUP
      let { moveCard } = this.props;
      for (let end = children.length - 1, index = end; index > end - 3; --index) {
        if (index < 0) return; // (end - 3) might go negative so check for below 0
        let refName = 'child-'+index;
        let { name } = this.refs[refName].props;
        moveCard({name, flipped: false}, 'DEAL-AREA-FACEUP');
      }
    } else {
      // If the card is already face up, let it handle its own MouseDown
      lastChild.handleMouseDown(e);
    }
  }
  handleTouchStart(e) {
    e.preventDefault();
    e.preventPropagation();
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseDown(touchObj);
    }
  }
  render() {
    let { faceUp, faceDown } = this.props;
    let faceUpHooked;
    let faceDownHooked;
    if (!faceUp.length) {
      faceDownHooked = [];
    } else {
      let len = faceUp.length;
      let index = len % 3;
      if (index) {
        // Round length to the nearest multiple of three
        len += index;
      }

      faceUpHooked = React.Children.map(faceUp, (child) => {
        // Add refs to all children and an onMouseDown handler to the last child
        // Disable mouseDown on all cards except the top one
        // Reposition cards so we always see three
        
        let thisIndex = index++;
        let offset = (thisIndex % 3) * 15;
        switch (thisIndex) {
          case len - 2:
            return React.cloneElement(child, {
              offsetX: 15,
              onMouseDown: (e) => false,
              onTouchStart: (e) => false
            });
          case len - 1:
            return React.cloneElement(child, {
              offsetX: 30
            });
          
          default:
            return React.cloneElement(child, {
              offsetX: 0,
              onMouseDown: (e) => false,
              onTouchStart: (e) => false
            });
        }
      });
    }
    if (!faceDown.length) {
      faceDownHooked = <div className={'reset'}
                            onMouseDown={this.handleMouseDown}
                            onTouchStart={this.handleTouchStart} />
    } else {
      let index = 0;
      faceDownHooked = React.Children.map(faceDown, (child) => {
        // Add refs to all children and an onMouseDown handler to the last child
        if (index !== faceDown.length - 1) {
          return React.cloneElement(child, {
            ref: 'child-' + (index++)
          });
        }
        console.log('Hooking MouseDown onto child ', child);
        return React.cloneElement(child, {
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleTouchStart,
          ref: 'child-' + (index++)
        });
      });
    }
    return (
      <div className={styles}>
        <span id={'left'}>
          {faceDownHooked}
        </span>
        <span id={'right'}>
          {faceUpHooked}
        </span>
      </div>
    )
  }
}

DealArea.propTypes = {
  faceUp: PropTypes.array.isRequired,
  faceDown: PropTypes.array.isRequired
}

export default DealArea;
