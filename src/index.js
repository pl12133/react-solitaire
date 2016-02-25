import 'babel-polyfill';
/* eslint-disable no-unused-vars*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/App/';

/* redux-devtools */
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

/* eslint-enable no-unused-vars*/

const store = configureStore();

const Game = () => (
  <div style={ {height: '100%'} }>
    <Provider store={store}>
      <App />
    </Provider>
    {/* <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel> */}
  </div>
);

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<Game />, root);
}

console.log('Runner runner');

export default Game;
