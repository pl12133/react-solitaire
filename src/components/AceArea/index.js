/* eslint-disable no-unused-vars*/
import React, {Component, PropTypes } from 'react';
/* eslint-enable no-unused-vars*/
import styles from './styles';

const AceArea = ({children}) => (
  <div id={'aceArea'} className={styles}>
    {children}
  </div>
);

export default AceArea;
