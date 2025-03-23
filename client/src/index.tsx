import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PostsProvider } from './context/PostsContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <BrowserRouter>
        <PostsProvider>
          <App />
        </PostsProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
