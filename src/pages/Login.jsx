import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import { auth } from "../firebase/firebase.js";

// import "./Login.css"
import "firebaseui/dist/firebaseui.css"
import { useEffect } from 'react';


const Login = () => {

    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
            },
            signInFlow: 'popup',
            signInSuccessUrl: '/home',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            tosUrl: '',
            privacyPolicyUrl: '',
        }
        ui.start('#firebaseui-auth-container', uiConfig);
    }, []);


    return (
        <div>
            <div>
                <h1>Twitter-clone</h1>
            </div>
            <div id='firebaseui-auth-container'></div>
        </div>
    )
}

export default Login;
