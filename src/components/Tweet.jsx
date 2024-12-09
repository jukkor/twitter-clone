import { useNavigate } from 'react-router-dom';
import { deleteTweet, formatTimestamp, likeTweet, subscribeTweetLikeCount, subscribeUserHasLikedTweet, unLikeTweet } from "../firebase/firebaseUtilities";
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

import './Tweet.css';
import TweetModal from './TweetModal';

import heartFilled from "../assets/favorite_24dp_filled.png";
import heartOutline from "../assets/favorite_24dp_outline.png";
import deleteIcon from "../assets/delete_24dp_outline.png";

function Tweet({ id, photoURL, displayName, content, userId, likeCount, createdAt }) {
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [hasLiked, setHasLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();

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

    const handleDelete = () => {
        deleteTweet(id);
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
                    {userId == user.uid ? <img className='delete-icon' src={deleteIcon} onClick={(e) => { e.stopPropagation(); handleDelete(); }} /> : <></>}
                </div>
                <p className="tweet-text">{content}</p>
                <div className="tweet-like-container" onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                }}>
                    <p>{currentLikeCount}</p>
                    <img className="tweet-button-like" src={hasLiked ? heartFilled : heartOutline} />
                </div>
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
