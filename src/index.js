import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './context/auth-context';
import NewPostProvider from './context/newPost-context';
import EditProfileProvider from './context/editProfile-context';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <NewPostProvider>
      <EditProfileProvider>
        <App />
      </EditProfileProvider>
      </NewPostProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);