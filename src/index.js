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

ReactDOM.render(
  <div style={ {height: '100%'} }>
    <Provider store={store}>
      <App />
    </Provider>
    {/* <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel> */}
  </div>,
  document.getElementById('root')
);
console.log('Runner runner');
