import './Login.css'
import google from '../assets/google.png';
import facebook from '../assets/facebook.png';
import email from '../assets/email.png';
import phone from '../assets/phone.png';

function Login() {

  return (
    <>
    <div className="logo-text">
      <h1>Twitter clone</h1>
    </div>
    <div className="auth-options">
      <div className="auth-buttons">
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
          <button>Sign in with Email</button>
        </div>
        <div className="auth-option">
          <img src={phone}></img>
          <button>Sign in with Phone</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login;