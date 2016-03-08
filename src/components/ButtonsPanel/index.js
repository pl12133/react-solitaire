/* eslint-disable no-unused-vars*/
import React, { Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/
import GameButton from '../../components/GameButton/';

const propTypes = {
  handleRedoButtonClick: PropTypes.func.isRequired,
  handleUndoButtonClick: PropTypes.func.isRequired,
  doWinAnimation: PropTypes.func.isRequired,
  handleDealButtonClick: PropTypes.func.isRequired,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
};
const ButtonsPanel = ({handleRedoButtonClick,
                       handleUndoButtonClick,
                       doWinAnimation,
                       canUndo,
                       canRedo,
                       handleDealButtonClick}) => (
  <div>
    <GameButton className={'btn btn-sucess'}
                float={'left'}
                disabled={canRedo}
                onClick={handleRedoButtonClick}>
      {'Redo!'}
    </GameButton>
    <GameButton className={'btn btn-sucess'}
                float={'left'}
                disabled={canUndo}
                onClick={handleUndoButtonClick}>
      {'Undo!'}
    </GameButton>
    {/* <GameButton className={'btn btn-sucess'}
                float={'left'}
                onClick={doWinAnimation}>
      {'Win!'}
    </GameButton> */}
    <GameButton className={'btn btn-primary'}
                float={'right'}
                onClick={handleDealButtonClick}>
      {'Deal!'}
    </GameButton>
  </div>
);

ButtonsPanel.propTypes = propTypes;
export default ButtonsPanel;
