import React, { useEffect } from "react";
import { useState } from "react";
import { subscribeToTweetComments } from "../firebase/firebaseUtilities";

import CommentBox from "./CommentBox";
import CommentList from "./CommentList";

import "./TweetModal.css";

const TweetModal = ({
  id: tweetId,
  photoURL,
  displayName,
  content,
  currentLikeCount,
  createdAt,
  hasLiked,
  toProfile,
  handleLike,
  closeModal
}) => {

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribeComments = subscribeToTweetComments(tweetId, setComments);

    return () => {
      unsubscribeComments();
    }
  }, [])


  return (
    <>
      <div className="modal-tweet-overlay" onClick={closeModal}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-tweet-container">
            <div className="modal-tweet-top-bar">
              <img className="modal-tweet-profile-picture" src={photoURL} onClick={toProfile} alt="Profile profile" />
              <h2 className="modal-profile-username" onClick={toProfile}>{displayName}</h2>
              <p className="modal-created-at-text">{createdAt}</p>
            </div>
            <div className="modal-tweet-content">
              <p className="modal-tweet-text">{content}</p>
            </div>
            <div className="modal-tweet-bottom-bar">
              <button
                onClick={handleLike}
                className="modal-like-button"
              >
                {hasLiked ? 'Unlike' : 'Like'} ({currentLikeCount})
              </button>
            </div>
          </div>
          <CommentBox {...{ id: tweetId, photoURL }} />
          <CommentList tweetId={tweetId} comments={comments} />
        </div>
      </div>
    </>
  );
}

export default TweetModal;
