import { db, auth } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { set, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

import "./UpdateProfilePage.css";


const UpdateProfilePage = () => {

    console.log(auth.currentUser);
    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formPayload = Object.fromEntries(formData);
        const authPayload = { displayName: formPayload.displayName, photoURL: formPayload.photoURL };

        console.log("Form payload", formPayload);
        console.log("User before update:", auth.currentUser);

        updateAuthUser(authPayload);
        updateRealtimeDatabaseUser(formPayload);
        navigate("/home");
    }

    const updateAuthUser = (authPayload) => {
        updateProfile(auth.currentUser, authPayload)
            .then(() => {
                console.log("User updated succesfully with the following information:", authPayload);
                console.log("New User Data:", auth.currentUser);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const updateRealtimeDatabaseUser = (formPayload) => {
        set(ref(db, "users/" + auth.currentUser.uid), formPayload)
            .then(() => {
                console.log("Realtime DB User updated succesfully with the following:", formPayload);

            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
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
