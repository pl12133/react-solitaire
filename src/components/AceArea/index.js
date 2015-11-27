import React, {Component, PropTypes } from 'react';
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
