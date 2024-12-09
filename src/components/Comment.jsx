
import { useEffect, useState } from "react";
import { likeComment, subscribeCommentLikeCount, subscribeHasLikedComment, unLikeComment } from "../firebase/firebaseUtilities";

import "./Comment.css";
import heartFilled from "../assets/favorite_24dp_filled.png";
import heartOutline from "../assets/favorite_24dp_outline.png"

const Comment = ({ tweetId, id, photoURL, displayName, content }) => {

    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const unsubscribeLikeCount = subscribeCommentLikeCount(tweetId, id, setLikeCount)
        const unsubscribeHasLiked = subscribeHasLikedComment(id, setHasLiked);

        return () => {
            unsubscribeLikeCount();
            unsubscribeHasLiked();
        }
    })

    const handleLike = () => {
        if (hasLiked) unLikeComment(tweetId, id);
        if (!hasLiked) likeComment(tweetId, id);
    }


    return (
        <>
            <div className="comment-container">
                <div className="comment-sender">
                    <img src={photoURL} />
                    <h3>{displayName}</h3>
                </div>
                <div className="comment-content">
                    <p>{content}</p>
                    <div className="like-container">
                        <p>{likeCount}</p>
                        <img className="button-like" onClick={handleLike} src={hasLiked ? heartFilled : heartOutline} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comment;
