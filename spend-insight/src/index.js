import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

const domain = "spend-insight.us.auth0.com";
const clientId = process.env.REACT_APP_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://spend-insight.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata read:users	read:users_app_metadata	update:users update:users_app_metadata	"
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </Provider>,
);

