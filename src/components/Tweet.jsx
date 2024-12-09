import { useNavigate } from 'react-router-dom';
import { formatTimestamp, likeTweet, subscribeTweetLikeCount, subscribeUserHasLikedTweet, unLikeTweet } from "../firebase/firebaseUtilities";
import { useState, useEffect } from 'react';

import './Tweet.css';
import TweetModal from './TweetModal';

function Tweet({ id, photoURL, displayName, content, userId, likeCount, createdAt }) {
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [hasLiked, setHasLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
        <>
            <div className="tweet-box" onClick={openModal}>
                <div className="user-info">
                    <img className="tweet-profile-picture" src={photoURL} onClick={toProfile} alt="Profile profile" />
                    <h3 className="profile-username" onClick={toProfile}>{displayName}</h3>
                    <p className="created-at-text">{formatTimestamp(createdAt)}</p>
                </div>
                <p className="tweet-text">{content}</p>
                <button
                    onClick={handleLike}
                    className="like-button"
                >
                    {hasLiked ? 'Unlike' : 'Like'} ({currentLikeCount})
                </button>
            </div>
            {isModalOpen && <TweetModal {...{
                id,
                photoURL,
                displayName,
                content,
                currentLikeCount,
                createdAt,
                hasLiked,
                toProfile,
                handleLike,
                closeModal
            }} />}
        </>
    )
}

export default Tweet;
