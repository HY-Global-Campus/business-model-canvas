import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import { BrowserRouter } from 'react-router-dom';
 
import App from './App';
 
import './index.css';

console.log("This is running in the main.tsx file");
 
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <BrowserRouter basename="/bos">
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
