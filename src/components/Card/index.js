/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

/* Styles */
import cssStyles from './styles/';
const cardStyle = cssStyles.styles || '';
const unflippedStyle = cssStyles.unflipped || '';
const flippedStyle = cssStyles.flipped || '';
//
const propTypes = {
  name: PropTypes.string.isRequired,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetWidth: PropTypes.number.isRequired,
  offsetHeight: PropTypes.number.isRequired,
  flipped: PropTypes.bool.isRequired,
  handleBeginDragDrop: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func, // For overriding a <Cards> MouseDown handler
  onTouchStart: PropTypes.func, // For overriding a <Cards> TouchStart handler
  onTouchTap: PropTypes.func,
  onDoubleClick: PropTypes.func
};

class Card extends Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState) {
    let { props } = this;
    let oldPropKeys = Object.keys(props);
    let newPropKeys = Object.keys(nextProps);
    if (oldPropKeys.length !== newPropKeys.length) {
      return true;
    }
    return !oldPropKeys.every(prop => {
      return props[prop].toString() === nextProps[prop].toString();
    });
  }
  render () {
    let {
      name,
      flipped,
      offsetLeft = 0,
      offsetTop = 0,
      offsetWidth = 0,
      offsetHeight = 0
    } = this.props;
    let className = cardStyle + ' ';
    className += (flipped)
      ? flippedStyle
      : unflippedStyle;

    return (
      <div
        id={name}
        className={className}
        style={ {
          zIndex: 10,
          position: 'absolute',
          width: offsetWidth + 'px',
          height: offsetHeight + 'px',
          top: offsetTop + 'px',
          left: offsetLeft + 'px'
        } }
        onMouseDown={this.props.onMouseDown || ((e) => this.props.handleBeginDragDrop(e, this))}
        onTouchStart={this.props.onTouchStart || ((e) => this.props.handleBeginDragDrop(e.changedTouches[0], this))}
        onTouchTap={this.props.onTouchTap}
        onDoubleClick={this.props.onDoubleClick}
      />
    );
  }
}

Card.propTypes = propTypes;

export default Card;
