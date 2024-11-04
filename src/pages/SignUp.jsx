import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import EmailLoginModal from '../components/EmailLoginModal';

import './Login.css'
import google from '../assets/google.png';
import facebook from '../assets/facebook.png';
import email from '../assets/email.png';
import phone from '../assets/phone.png';

const SignUp = () => {
    const { setUser } = useUser();
    const { user } = useUser();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const navigate = useNavigate();

    if (user) {
        navigate("/home");
    }

    const handleEmailSignUp = async (email, password) => {

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUser(user);
            useNavigate("/createprofile");
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
                <h2>Sign Up</h2>
            </div>
            <div className="auth-container">
                <div className="auth-options-container">
                    <div className="auth-option">
                        <img src={google}></img>
                        <button>Sign up with Google</button>
                    </div>
                    <div className="auth-option">
                        <img src={facebook}></img>
                        <button>Sign up with Facebook</button>
                    </div>
                    <div className="auth-option">
                        <img src={email}></img>
                        <button onClick={() => setShowEmailModal(true)}>Sign up with Email</button>
                        {/* Email Login Modal */}
                        {showEmailModal && (
                            <EmailLoginModal
                                onClose={() => setShowEmailModal(false)}
                                onLogin={handleEmailSignUp}
                            />
                        )}
                    </div>
                    <div className="auth-option">
                        <img src={phone}></img>
                        <button onClick={() => {
                            // setupRecaptcha();
                            // setShowPhoneModal();
                        }}>Sign up with Phone</button>
                    </div>
                </div>
                <a href='/login'>Already have an account? Log in here!</a>
            </div>
        </>
    )
}

export default SignUp;
