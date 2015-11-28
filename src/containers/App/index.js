import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cardActionCreators from 'actions/cards';
import * as dragActionCreators from 'actions/dragdrop';

import Table from 'components/Table'

import styles from './styles/';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  return {
    dragdrop: state.dragdrop,
    cards: state.cards.present
  }
}

function mapDispatchToProps(dispatch) {
  let allActionCreators = Object.assign({},
                                        dragActionCreators,
                                        cardActionCreators);
  return bindActionCreators(allActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
