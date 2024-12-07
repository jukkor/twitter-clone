import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../firebase/firebaseUtilities";

import Sidebar from "../components/Sidebar";

import "./UpdateProfilePage.css";

const UpdateProfilePage = () => {
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formPayload = Object.fromEntries(formData);
        updateUser(formPayload);
        navigate("/home");
    }


    return (
        <>
            <Sidebar />
            <div>
                <div className="logo-text">
                    <h1>Twitter clone</h1>
                </div>
                <div className="logo-text">
                    <h2>Update Profile</h2>
                </div>
                <div className="auth-container">
                    <div className="auth-options-container">
                        <form onSubmit={submitForm}>
                            <div>
                                <label htmlFor="displayName">Display Name:</label>
                                <input name="displayName" />
                            </div>
                            <div>
                                <label>Avatar Url:</label>
                                <input name="photoURL" />
                            </div>
                            <div>
                                <label>Bio Text:</label>
                                <textarea name="bioText" />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfilePage;
