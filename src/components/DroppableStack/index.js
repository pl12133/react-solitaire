import React, { Component, PropTypes } from 'react';
/* Styles */
import styles from './styles/'

class DroppableStack extends Component {
  constructor(props) {
    super(props);

    this.width = 75;
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
