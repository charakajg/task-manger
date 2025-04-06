import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ErrorBoundary
    fallback={
      <div className="error-screen">
        <h1>Something went wrong</h1>
      </div>
    }>
    <App />
  </ErrorBoundary>,
);
