import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, update, onValue } from "firebase/database";
import { db, auth } from "../firebase/firebase";
import { useState, useEffect } from 'react';

import './Tweet.css';

function Tweet({ id, profilePicture, username, content, userId, likeCount }) {
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [hasLiked, setHasLiked] = useState(false);
    const navigate = useNavigate();

    const toProfile = () => {
        navigate(`/user/${userId}`);
    }

    const handleLike = () => {
        const likesRef = ref(db, `tweetLikes/${id}`);

        if (hasLiked) {
            update(likesRef, {
                [auth.currentUser.uid]: false
            });
        } else {
            update(likesRef, {
                [auth.currentUser.uid]: true
            });
        }
    }
    useEffect(() => {
        const likesRef = ref(db, `tweetLikes/${id}`);
        
        const unsubscribe = onValue(likesRef, (snapshot) => {
            const likesData = snapshot.val();
            if (likesData) {

                const newLikeCount = Object.values(likesData).filter(like => like === true).length;
                setCurrentLikeCount(newLikeCount);

                setHasLiked(!!likesData[auth.currentUser.uid]);
            }
        });

        return () => unsubscribe();

    }, [id, handleLike]);

    return (
        <div className="tweet-box">
            <div className="user-info">
                <img className="profile-picture" src={profilePicture} onClick={toProfile} alt="Profile profile" />
                <h3 className="profile-username" onClick={toProfile}>{username}</h3>
            </div>
            <p className="tweet-text">{content}</p>
            <button onClick={handleLike} className="like-button">
                {hasLiked ? 'Unlike' : 'Like'} ({currentLikeCount})
            </button>
        </div>
    )
}

export default Tweet;
