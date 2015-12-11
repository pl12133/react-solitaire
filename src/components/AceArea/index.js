/* eslint-disable no-unused-vars*/
import React, {Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/
import styles from './styles';

class AceArea extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div id={'aceArea'} className={styles}>
        {this.props.children}
      </div>
    );
  }
}

AceArea.propTypes = {

};

export default AceArea;
