import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { getUser } from "../firebase/firebaseUtilities";
import { useUser } from "../contexts/UserContext";
import { updateUser } from "../firebase/firebaseUtilities";

import Sidebar from "../components/Sidebar";

import "./UpdateProfilePage.css";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [profile, setProfile] = useState({
        displayName: '',
        photoURL: '',
        bioText: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const existingUser = await getUser(user.uid);
            if (existingUser) {
                setProfile({
                    displayName: existingUser.displayName || '',
                    photoURL: existingUser.photoURL || '',
                    bioText: existingUser.bioText || '',
                });
            }
        }
        fetchUserProfile();
    }, []);


    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formPayload = Object.fromEntries(formData);
        updateUser(formPayload);
        navigate("/home");
    };

    const handleFormCancel = () => {
        const userId = auth.currentUser.uid;
        navigate(`/user/${userId}`);
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
                            <div className="form-group">
                                <label htmlFor="displayName">Display Name:</label>
                                <input name="displayName" defaultValue={profile.displayName} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="photoURL">Avatar Url:</label>
                                <input name="photoURL" defaultValue={profile.photoURL} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bioText">Bio Text:</label>
                                <textarea name="bioText" defaultValue={profile.bioText}></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="submit">Submit</button>
                                <button onClick={handleFormCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProfilePage;
