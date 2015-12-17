/* eslint-disable no-unused-vars*/
import React, { PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

import styles from './styles/';

const propTypes = {
  className: PropTypes.string.isRequired,
  float: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

const GameButton = ({className, float, onClick, children}) => {
  return (
    <button className={className + ' ' + styles}
            style={ {float} }
            onClick={onClick}>
      {children}
    </button>
  );
};

GameButton.propTypes = propTypes;

export default GameButton;
