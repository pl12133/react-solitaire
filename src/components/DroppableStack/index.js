import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/'

class DroppableStack extends Component {
  constructor(props) {
    super(props);

    this.width = 75;
  }
  render() {
    let { offsetLeft, index } = this.props;
    index -= 1; 
    offsetLeft = offsetLeft || 0;
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
  index: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  offsetLeft: PropTypes.number
}
export default DroppableStack;
