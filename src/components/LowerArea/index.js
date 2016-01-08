/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

import styles from './styles/';

const propTypes = {
  children: PropTypes.node.isRequired
};

class LowerArea extends Component {
  render () {
    let { children } = this.props;
    return (
      <div className={styles}
           id={'lowerArea'}
      >
        {children}
      </div>
    );
  }
}

LowerArea.propTypes = propTypes;

export default LowerArea;
