import React, { Component, PropTypes } from 'react';

/* Styles */
import styles from './styles/'

const propTypes = {
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  isDragging: PropTypes.bool.isRequired,
  flipped: PropTypes.bool.isRequired
}

class Card extends Component {
  constructor(props) {
    super(props);
    let ownFuncs = [ "handleMouseDown", "flip", "isFlipped" ]
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error("Attempt to self-bind \'" + elem + "\' to <Card> failed");
        return;
      }
      this[elem] = this[elem].bind(this);
    })

    this.state = { toggleFlip: false }
  }

  handleMouseDown(e) {
    let { isDragging } = this.props;
    if (!isDragging) {
      this.props.handleBeginDragDrop(e, this);
    }
  }

  flip() {
    this.setState({
      toggleFlip: !this.state.toggleFlip
    })
  }

  isFlipped() {
    return (this.props.flipped ^ this.state.toggleFlip);
  }

  render() {
    let { name, flipped } = this.props;
    let { toggleFlip } = this.state;
    return (
      <div id={name} className={(flipped ^ toggleFlip) ? styles : ""}
                     style={ {
                       zIndex: 10,
                       position: 'absolute',
                       top: (this.props.offsetY || 0) + 'px',
                       left: (this.props.offsetX || 0) + 'px'} }
                     onMouseDown={this.handleMouseDown}>
      </div>
    )
  }
}

Card.propTypes = propTypes;

export default Card;
