import React, { Component, PropTypes } from 'react';

/* Styles */
import styles from './styles/'

const DISPLAY_NAME = '<Card>';
const propTypes = {
  name: PropTypes.string.isRequired,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetWidth: PropTypes.number.isRequired,
  offsetHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  flipped: PropTypes.bool.isRequired,
  handleBeginDragDrop: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func, // For overriding a <Cards> MouseDown handler
  onTouchStart: PropTypes.func, // For overriding a <Cards> TouchStart handler
  onTouchTap: PropTypes.func,
  onDoubleClick: PropTypes.func
}

class Card extends Component {
  constructor(props) {
    super(props);
    let ownFuncs = [ "handleMouseDown", "isFlipped", "handleTouchStart", "render" ]
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error(`Attempt to self-bind \'${elem}\' to ${DISPLAY_NAME} failed`);
        return;
      }
      this[elem] = this[elem].bind(this);
    })

    //this.state = { toggleFlip: false }
  }
  handleMouseDown(e) {
    let { isDragging } = this.props;
    if (!isDragging) {
      let dragging = [this];
      this.props.handleBeginDragDrop(e, dragging);
    }
  }
  handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    let touchObj = e.changedTouches[0];
    if (touchObj) {
      this.handleMouseDown(touchObj);
    }
  }
  isFlipped() {
    return (this.props.flipped);
  }

  render() {
    let { name,
          flipped,
          offsetLeft = 0,
          offsetTop = 0,
          offsetWidth = 0,
          offsetHeight = 0 } = this.props;
    return (
      <div id={name} className={(flipped) ? styles : ""}
                     style={ {
                       zIndex: 10,
                       position: 'absolute',
                       width: offsetWidth + 'px',
                       height: offsetHeight + 'px',
                       top: offsetTop + 'px',
                       left: offsetLeft + 'px'} }
                     onMouseDown={this.props.onMouseDown || this.handleMouseDown}
                     onTouchStart={this.props.onTouchStart || this.handleTouchStart}
                     onTouchTap={this.props.onTouchTap}
                     onDoubleClick={this.props.onDoubleClick} >
      </div>
    )
  }
}

Card.propTypes = propTypes;

export default Card;
