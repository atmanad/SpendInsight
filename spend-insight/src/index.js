import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="spend-insight.us.auth0.com"
    clientId="Nirp01mxs3XbFyXa62dXg2pbveIYI9EA"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
);

