import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HomePage } from './components/HomePage';
import { AuthCallback } from './components/AuthCallback';
import './index.css';

function Root() {
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }
  const token = localStorage.getItem('token');
  return token ? <App /> : <HomePage />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
