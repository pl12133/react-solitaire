import React, {Component, PropTypes } from 'react';
import styles from './styles'

class DealArea extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={styles}>
        {'I am where you will deal the cards'}
        {this.props.children}
      </div>
    )
  }
}

DealArea.propTypes = {

}

export default DealArea;
