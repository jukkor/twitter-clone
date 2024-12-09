import React, { useState } from "react";

import "./EmailLoginModal.css";

const EmailLoginModal = ({ handleOnClose, handleOnClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="email-modal">
            <div className="modal-content">
                <h3>Email</h3>
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
                <button onClick={() => handleOnClick(email, password)}>Proceed</button>
                <button onClick={handleOnClose}>Close</button>
            </div>
        </div>
    );
};

export default EmailLoginModal;
