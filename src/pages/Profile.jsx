import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [userTweets, setUserTweets] = useState([]);
  const [profile, setProfile] = useState({
    displayName: 'Loading...',
    photoURL: 'https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg',
    bioText: 'Loading bio...',
  });

  useEffect(() => {
    const unsubscribeUser = subscribeToUser(id, setProfile);
    const unsubscribeTweets = subscribeToTweets(setUserTweets);

    return () => {
      unsubscribeUser;
      unsubscribeTweets;
    }
  }, [id]);

  const navigateToUpdateProfile = () => {
    navigate('/updateprofile', { state: { profile } });
  }


  const currentUserTweets = userTweets.filter(tweet => tweet.username === profile.displayName);

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
            {user.uid === id ? <button className="edit-button" onClick={navigateToUpdateProfile}>Edit</button> : <></>}
          </div>
          <p className="bio-text">{profile.bioText}</p>
        </div>
      </div>
      <h3 className="tweet-list-header">Tweets by {profile.displayName}:</h3>
      <TweetList tweets={currentUserTweets} />
    </>
  )
};

export default Profile;
