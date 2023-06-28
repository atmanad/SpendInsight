import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const FirebaseUI = () => {
  const firebaseUiContainerRef = useRef(null);

  useEffect(() => {
    const firebaseUiConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID, // Enable email authentication
        firebase.auth.GoogleAuthProvider.PROVIDER_ID, // Enable Google authentication
        // Add more sign-in options as needed
      ],
      // Additional configuration options for FirebaseUI
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start(firebaseUiContainerRef.current, firebaseUiConfig);

    // Clean up the FirebaseUI instance when the component unmounts
    return () => ui.delete();
  }, []);

  return <div ref={firebaseUiContainerRef}></div>;
};

export default FirebaseUI;
