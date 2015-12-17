import React, { Component, PropTypes } from 'react';

import styles from './styles/';

const propTypes = {
  className: PropTypes.string.isRequired,
  float: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

const GameButton = ({className, float, onClick, children}) => {
  return (
    <button className={className + ' ' + styles}
            style={ {float} }
            onClick={onClick}>
      {children}
    </button>
  )
};

GameButton.propTypes = propTypes;

export default GameButton;
