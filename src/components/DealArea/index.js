import React, {Component, PropTypes } from 'react';
import styles from './styles';

const DISPLAY_NAME = '<DealArea>';
const FLIP_AT_A_TIME = 3;

const propTypes = {
  faceUp: PropTypes.array.isRequired,
  faceDown: PropTypes.array.isRequired,
  getAvailableMoves: PropTypes.func.isRequired,
  moveCards: PropTypes.func.isRequired
};
class DealArea extends Component {
  constructor (props) {
    super(props);
    let ownFuncs = [
      'handleMouseDown', 'handleDoubleClick',
      'handleTouchTap', 'handleTouchStart'
    ];
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    let { faceUp: oldFaceUp, faceDown: oldFaceDown } = this.props;
    let { faceUp: newFaceUp, faceDown: newFaceDown } = nextProps;
    return oldFaceUp.length !== newFaceUp.length || oldFaceDown.length !== newFaceDown.length;
  }
  handleTouchTap (e) {
    e.preventDefault();
    this.handleDoubleClick(e);
  }
  handleMouseDown (e) {
    // Called when the top <Card> of <DealArea> is clicked
    let { faceDown: children } = this.props;
    let childRefName = 'child-' + (children.length - 1);
    let lastChild = this.refs[childRefName];
    if (!lastChild) {
      let { moveCards, faceUp } = this.props;
      let toMove = faceUp.reverse().map((card) => {
        return {
          name: card.props.name,
          flipped: true
        };
      });
      moveCards(toMove, 'DEAL-AREA-FACEDOWN');
      return;
    }
    let { flipped } = lastChild.props;
    if (flipped) {
      // If the card is face down, flip the top three cards off the stack and move to FACEUP
      let { moveCards } = this.props;
      let toMove = children.slice(-FLIP_AT_A_TIME).reverse().map((card) => {
        let { name } = card.props;
        return {
          name,
          flipped: false
        };
      });
      moveCards(toMove, 'DEAL-AREA-FACEUP');
    }
  }
  handleDoubleClick (e) {
    let { getAvailableMoves } = this.props;
    let clickedCardName = e.target.id;
    let canMoveTo = getAvailableMoves(clickedCardName, 1);
    if (canMoveTo.length) {
      let { moveCards } = this.props;
      moveCards({
        name: clickedCardName,
        flipped: false
      }, canMoveTo[0]);
    }
  }
  handleTouchStart (e) {
    e.preventDefault();

    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseDown(touchObj);
    }
  }
  render () {
    let { faceUp, faceDown, offsetWidth, offsetHeight } = this.props;
    let faceUpHooked;
    if (!faceUp.length) {
      faceUpHooked = [];
    } else {
      let { length: len } = faceUp;
      let index = 0;
      let noopHandlers = {
        onMouseDown: (e) => false,
        onTouchStart: (e) => false
      };
      faceUpHooked = React.Children.map(faceUp, (child) => {
        // Add refs to all children and an onMouseDown handler to the last child
        // Disable mouseDown on all cards except the top one
        // Reposition cards so we always see three
        let thisIndex = index++;
        switch (thisIndex) {
          case len - 2:
            return React.cloneElement(child, {
              offsetLeft: offsetWidth * 0.15,
              ...noopHandlers
            });
          case len - 1:
            return React.cloneElement(child, {
              offsetLeft: offsetWidth * 0.30,
              onDoubleClick: this.handleDoubleClick,
              onTouchTap: this.handleTouchTap
            });

          default:
            return React.cloneElement(child, {
              offsetLeft: 0,
              ...noopHandlers
            });
        }
      });
    }
    let faceDownHooked;
    if (!faceDown.length) {
      faceDownHooked = <div className={'reset'}
                            onMouseDown={this.handleMouseDown}
                            onTouchStart={this.handleTouchStart} />;
    } else {
      let index = 0;
      faceDownHooked = React.Children.map(faceDown, (child) => {
        // Add refs to all children and an onMouseDown handler to the last child
        if (index !== faceDown.length - 1) {
          return React.cloneElement(child, {
            ref: 'child-' + (index++)
          });
        }
        return React.cloneElement(child, {
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleTouchStart,
          ref: 'child-' + (index++)
        });
      });
    }
    let leftOffsetWidth = (faceDownHooked.length) ? offsetWidth + 'px'
                                                  : '50%';
    return (
      <div className={styles}
           style={ {height: (1.02 * offsetHeight) + 'px'} }>
        <span id={'left'}
              style={ {width: leftOffsetWidth,
                       height: offsetHeight + 'px'} }>
          {faceDownHooked}
        </span>
        <span id={'right'}
              style={ {width: offsetWidth + 'px',
                       height: offsetHeight + 'px'} }>
          {faceUpHooked}
        </span>
      </div>
    );
  }
}

DealArea.propTypes = propTypes;

export default DealArea;
