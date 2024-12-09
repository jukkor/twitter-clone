import React, { useEffect } from "react";
import { useState } from "react";
import { subscribeToTweetComments } from "../firebase/firebaseUtilities";

import CommentBox from "./CommentBox";
import CommentList from "./CommentList";

import "./TweetModal.css";

import heartFilled from "../assets/favorite_24dp_filled.png";
import heartOutline from "../assets/favorite_24dp_outline.png"

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
            <div className="modal-like-container" onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                        }}>
                        <p>{currentLikeCount}</p>
                        <img className="modal-button-like" src={hasLiked ? heartFilled : heartOutline} />
                </div>
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
