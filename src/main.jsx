import React from 'react';
import { createRoot } from 'react-dom/client'; // New import for React 18
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // New root initialization

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
