import './Login.css'

function Login() {

  return (
    <>
    <div className="logo-text">
      <h1>Twitter clone</h1>
    </div>
    <div className="auth-options">
      <div className="auth-buttons">
        <button>Sign in with Google</button>
        <button>Sign in with Facebook</button>
        <button>Sign in with Email</button>
        <button>Sign in with Phone</button>
      </div>
    </div>
    </>
  )
}

export default Login;