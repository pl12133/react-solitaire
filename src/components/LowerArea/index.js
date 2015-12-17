import React, { Component, PropTypes } from 'react';

import styles from './styles/';

const propTypes = {
  children: PropTypes.node.isRequired
};

class LowerArea extends Component {
  render() {
    let { children } = this.props;
    return (
      <div className={styles}>
        {children}
      </div>
    )
  }
}

LowerArea.propTypes = propTypes;

export default LowerArea;
