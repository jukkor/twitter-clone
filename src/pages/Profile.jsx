import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useUser } from '../contexts/UserContext';
import { subscribeToTweets, subscribeToUser } from '../firebase/firebaseUtilities';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';

import './Profile.css';

const Profile = () => {
  let { id } = useParams();
  const { user } = useUser();

  console.log(id);

  const [userTweets, setUserTweets] = useState([]);

  const [profile, setProfile] = useState({
    displayName: '',
    photoURL: '',
    bioText: '',
  });

  useEffect(() => {
    const unsubscribeUser = subscribeToUser(id, setProfile);
    const unsubscribeTweets = subscribeToTweets(setUserTweets);

    return () => {
      unsubscribeUser;
      unsubscribeTweets;
    }
  }, [id]);


  const currentUserTweets = userTweets.filter(tweet => tweet.username === profile.displayName);
  console.log(JSON.stringify(currentUserTweets));

  return (
    <>
      <Sidebar />
      <div>
        <div className="profile-box">
          <div className="name-and-picture-box">
            <img
              className="profile-picture"
              src={profile.photoURL}
              alt="Profile picture"
            />
            <h2>{profile.displayName}</h2>
          </div>
          <p className="bio-text">{profile.bioText}</p>
        </div>
      </div>
      <h3 className="tweet-list-header">Tweets by {profile.displayName}:</h3>
      <TweetList tweets={currentUserTweets} />
    </>
  );
};

export default Profile;
