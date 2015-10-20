import React, { Component, PropTypes } from 'react';

/* Styles */
import styles from './styles/'

const propTypes = {
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  isDragging: PropTypes.bool.isRequired,
  flipped: PropTypes.bool
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleMouseDown(e) {
    let { isDragging } = this.props;
    if (!isDragging) {
      this.props.handleBeginDragDrop(e, this);
    }
  }

  render() {
    let { name, flipped } = this.props;
    return (
      <div id={name} className={(flipped) ? styles : ""}
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
