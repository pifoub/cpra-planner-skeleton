import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/** Bootstraps the React application. */
createRoot(document.getElementById('root')!).render(<App />);

