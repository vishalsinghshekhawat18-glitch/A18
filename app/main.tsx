import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/reset.css';
import './styles/theme-kindle.css';
import './styles/explain-simply.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
