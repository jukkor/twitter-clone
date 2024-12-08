import { useNavigate } from 'react-router-dom';
import { formatTimestamp, likeTweet, subscribeTweetLikeCount, subscribeUserHasLikedTweet, unLikeTweet } from "../firebase/firebaseUtilities";
import { useState, useEffect } from 'react';

import './Tweet.css';

function Tweet({ id, photoURL: profilePicture, displayName: username, content, userId, likeCount, createdAt }) {
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [hasLiked, setHasLiked] = useState(false);
    const navigate = useNavigate();

    const toProfile = () => {
        navigate(`/user/${userId}`);
    }

    const handleLike = () => {
        if (!hasLiked) likeTweet(id);
        if (hasLiked) unLikeTweet(id);
    }

    useEffect(() => {
        const unsubscribeHasLiked = subscribeUserHasLikedTweet(id, setHasLiked);
        const unsubscribeLikeCount = subscribeTweetLikeCount(id, setCurrentLikeCount);
        return () => {
            unsubscribeHasLiked();
            unsubscribeLikeCount();
        };

    }, [id]);

    return (
        <div className="tweet-box">
            <div className="user-info">
                <img className="tweet-profile-picture" src={profilePicture} onClick={toProfile} alt="Profile profile" />
                <h3 className="profile-username" onClick={toProfile}>{username}</h3>
                <p className="created-at-text">{formatTimestamp(createdAt)}</p>
            </div>
            <p className="tweet-text">{content}</p>
            <button onClick={handleLike} className="like-button">
                {hasLiked ? 'Unlike' : 'Like'} ({currentLikeCount})
            </button>
        </div>
    )
}

export default Tweet;
