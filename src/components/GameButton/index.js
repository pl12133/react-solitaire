/* eslint-disable no-unused-vars*/
import React, { PropTypes } from 'react';
/* eslint-enable no-unused-vars*/

import styles from './styles/';

const propTypes = {
  className: PropTypes.string.isRequired,
  float: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
};

const GameButton = ({className, float, onClick, children, disabled}) => {
  return (
    <button className={className + ' ' + styles}
            style={ {float} }
            disabled={disabled}
            onClick={onClick}>
      {children}
    </button>
  );
};

GameButton.propTypes = propTypes;

export default GameButton;
