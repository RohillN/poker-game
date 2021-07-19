import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';

class AuthCheckRedirect extends React.Component {
    
    checkIfLoggedOut() {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) {
              window.location = '/login';
            }
        });
    }  
}

export default AuthCheckRedirect;
