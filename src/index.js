import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // react-router



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  // </Provider>,
);