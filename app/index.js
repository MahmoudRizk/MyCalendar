import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './app.global.css';


import App from './containers/App'

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('root')
    );
}
