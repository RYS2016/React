import React from 'react';
import ReactDOM from 'react-dom/client';  // ✅ Correct for React 18
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { defineCustomElements } from 'h8k-components/loader';

const root = ReactDOM.createRoot(document.getElementById('root'));  // ✅ Use createRoot()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker(); 
defineCustomElements(window);


