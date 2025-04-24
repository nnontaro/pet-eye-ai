// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <<< Router ตัวหลัก
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
          domain="dev-w6lkjzjgjfjvq0fi.us.auth0.com"
          clientId="2g4eEHiuA4zh9ecZITLweSZPAqtZcpbV"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);