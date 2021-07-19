import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { firebaseApp } from './FirebaseConfig';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import { FirestoreProvider } from 'react-firestore';
import { FirebaseAuthProvider } from "@react-firebase/auth";

firebase.initializeApp(firebaseApp);

firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
    } else if (err.code === 'unimplemented') {
    }
  });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

ReactDOM.render(
  <React.StrictMode>
    <FirestoreProvider firebase={firebase}>
      <FirebaseAuthProvider firebase={firebase}>
        <App />
      </FirebaseAuthProvider>
    </FirestoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
