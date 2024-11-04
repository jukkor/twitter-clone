import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

import EmailLoginModal from "../components/EmailLoginModal";

import './Login.css'
import google from '../assets/google.png';
import facebook from '../assets/facebook.png';
import email from '../assets/email.png';
import phone from '../assets/phone.png';

const Login = () => {
  const { setUser } = useUser();
  const { user } = useUser();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  if (user) {
    navigate("/home");
  }

  const handleEmailLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      navigate("/home");
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  return (
    <>
      <div className="logo-text">
        <h1>Twitter clone</h1>
      </div>
      <div className="logo-text">
        <h2>Login</h2>
      </div>
      <div className="auth-container">
        <div className="auth-options-container">
          <div className="auth-option">
            <img src={google}></img>
            <button>Sign in with Google</button>
          </div>
          <div className="auth-option">
            <img src={facebook}></img>
            <button>Sign in with Facebook</button>
          </div>
          <div className="auth-option">
            <img src={email}></img>
            <button onClick={() => setShowEmailModal(true)}>Sign in with Email</button>
            {/* Email Login Modal */}
            {showEmailModal && (
              <EmailLoginModal
                onClose={() => setShowEmailModal(false)}
                onLogin={handleEmailLogin}
              />
            )}
          </div>
          <div className="auth-option">
            <img src={phone}></img>
            <button onClick={() => {
              // setupRecaptcha();
              // setShowPhoneModal();
            }}>Sign in with Phone</button>
          </div>
        </div>
        <a href='/signup'>Don't have an account? Sign up here!</a>
      </div>
    </>
  )
}



export default Login;
