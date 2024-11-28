import React, { useState } from 'react';
import { db, auth } from "../firebase/firebase";
import { set, ref, push } from "firebase/database";

import './TweetButton.css';

const TweetButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweet, setTweet] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const submitTweet = (e) => {
    e.preventDefault();

    console.log("Tweet content: ", tweet);

    postTweet(tweet);

  }

  const postTweet = (tweetContent) => {
    if (tweetContent.length > 0) {
      console.log("Tweet submitted");

      // Create a new tweet object with attributes
      const newTweet = {
        content: tweetContent,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        media: "placeholder"
      };

      // Push the new tweet object to the database
      const newTweetRef = push(ref(db, "tweets"));
      set(newTweetRef, newTweet)
        .then(() => {
          console.log("Realtime DB tweet submitted with content:", newTweet);
        })
        .catch((error) => {
          console.log(error);
        });

      setTweet('');
      closeModal();
    }
  };

  return (
    <>
      <button className="tweet-button" onClick={openModal}>Tweet</button>

      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-content">
              <h3>New tweet</h3>
              <textarea
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                placeholder="Start typing..."
              />
              <div className="modal-actions">
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                <button className="submit-button" onClick={submitTweet}>Tweet</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TweetButton;



