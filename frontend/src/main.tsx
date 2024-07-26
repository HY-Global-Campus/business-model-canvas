import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import { BrowserRouter } from 'react-router-dom';
import queryClient from './App/utils/queryClient'; 
import App from './App';
 
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
