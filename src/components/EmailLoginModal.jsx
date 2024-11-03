import React, { useState } from "react";

const EmailLoginModal = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Email Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => onLogin(email, password)}>Sign In</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EmailLoginModal;
