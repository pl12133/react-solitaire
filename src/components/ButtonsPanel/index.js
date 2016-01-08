/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/
import GameButton from 'components/GameButton/';

const propTypes = {
  handleRedoButtonClick: PropTypes.func.isRequired,
  handleUndoButtonClick: PropTypes.func.isRequired,
  doWinAnimation: PropTypes.func.isRequired,
  handleDealButtonClick: PropTypes.func.isRequired
};
const ButtonsPanel = ({handleRedoButtonClick,
                       handleUndoButtonClick,
                       doWinAnimation,
                       handleDealButtonClick}) => (
  <div>
    <GameButton className={'btn btn-sucess'}
                float={'left'}
                onClick={handleRedoButtonClick}>
      {'Redo!'}
    </GameButton>
    <GameButton className={'btn btn-sucess'}
                float={'left'}
                onClick={handleUndoButtonClick}>
      {'Undo!'}
    </GameButton>
    <GameButton className={'btn btn-sucess'}
                float={'left'}
                onClick={doWinAnimation}>
      {'Win!'}
    </GameButton>
    <GameButton className={'btn btn-primary'}
                float={'right'}
                onClick={handleDealButtonClick}>
      {'Deal!'}
    </GameButton>
  </div>
);

ButtonsPanel.propTypes = propTypes;
export default ButtonsPanel;
