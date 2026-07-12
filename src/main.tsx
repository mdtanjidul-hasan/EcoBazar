import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Runtime Environment Verification Layer
const verifyEnvironment = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      new URL(apiUrl);
    } catch (e) {
      console.error(
        `🚨 [EcoBazar Environment Error]: VITE_API_URL "${apiUrl}" is not a valid URL format.`
      );
    }
  }
};

verifyEnvironment();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
