import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import { BrowserRouter } from 'react-router-dom';
 
import App from './App';
 
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <BrowserRouter basename="/bos">
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
