import { combineReducers } from 'redux';
import dragdrop from './dragdrop';
import cards from './cards';

const rootReducer = combineReducers({
  dragdrop,
  cards
});

export default rootReducer;
