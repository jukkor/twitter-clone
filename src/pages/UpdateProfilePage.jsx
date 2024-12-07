import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";

import "./UpdateProfilePage.css";

const UpdateProfilePage = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        displayName: '',
        photoURL: '',
        bioText: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userRef = ref(db, `/users/${userId}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setProfile({
                        displayName: data.displayName || '',
                        photoURL: data.photoURL || '',
                        bioText: data.bioText || '',
                    });
                } else {
                    console.error("No user data found!");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formPayload = Object.fromEntries(formData);
        const authPayload = {
            displayName: formPayload.displayName,
            photoURL: formPayload.photoURL,
        };

        updateAuthUser(authPayload);
        updateRealtimeDatabaseUser(formPayload);
        navigate("/home");
    };

    const updateAuthUser = (authPayload) => {
        updateProfile(auth.currentUser, authPayload)
            .then(() => {
                console.log("User updated successfully:", authPayload);
            })
            .catch((error) => {
                console.error("Error updating auth user:", error);
            });
    };

    const updateRealtimeDatabaseUser = (formPayload) => {
        const userId = auth.currentUser.uid;
        set(ref(db, `/users/${userId}`), formPayload)
            .then(() => {
                console.log("Realtime database user updated successfully:", formPayload);
            })
            .catch((error) => {
                console.error("Error updating database user:", error);
            });
    };

    const handleFormCancel = () => {
        const userId = auth.currentUser.uid;
        navigate(`/user/${userId}`);
    }

    return (
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
    );
};

export default UpdateProfilePage;
