// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <<< Import ที่นี่
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <<< Router ต้องครอบ Auth0Provider */}
      <Auth0Provider
          domain="dev-ocmlehsrb5rrnrxr.us.auth0.com"
          clientId="N9X0DcxuCjiIkY63rftP0B1E3iEOxkd6"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: 'https://api.peteye.ai' // ตรวจสอบว่าถูกต้อง
          }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);