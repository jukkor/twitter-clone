import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useUser } from '../contexts/UserContext';

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
    const fetchUserProfile = async () => {
      try {
        const userRef = ref(db, `/users/${id}`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Fetched user profile data:', data);
  
          if (data) {
            setProfile({
              displayName: data.displayName || 'No display name',
              photoURL: data.photoURL || '',
              bioText: data.bioText || 'No bio available',
            });
          } else {
            setProfile({
              displayName: 'No display name',
              photoURL: '',
              bioText: 'No bio available',
            });
          }
        });
  
        return () => unsubscribeUser();
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    };
  
    const fetchTweets = async () => {
      try {
        const tweetsRef = ref(db, 'tweets');
        const unsubscribeTweets = onValue(tweetsRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const tweetsArray = await Promise.all(
              Object.entries(data).map(async ([key, value]) => {
                const userRef = ref(db, `users/${value.userId}`);
                const userSnapshot = await get(userRef);
                const userProfile = userSnapshot.val();
  
                return {
                  id: key,
                  userId: value.userId,
                  username: userProfile?.displayName || null,
                  profilePicture: userProfile?.photoURL || null,
                  content: value.content,
                  likeCount: value.likeCount,
                };
              })
            );
  
            setUserTweets(tweetsArray);
          } else {
            setUserTweets([]);
          }
        });
  
        return () => unsubscribeTweets;
      } catch (error) {
        console.log('Error fetching tweets:', error);
      }
    };
    fetchUserProfile();
    fetchTweets();
  }, [id]);

  const navigateToUpdateProfile = () => {
    navigate('/updateprofile', { state: { profile }});
  }
  

  const currentUserTweets = userTweets.filter(tweet => tweet.username === profile.displayName);

  let pageContent;

  if (user.uid === id) {
    console.log("Logged in user viewing own profile");
    pageContent = (
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
                        <button className="edit-button" onClick={navigateToUpdateProfile}>Edit</button>
                    </div>
                    <p className="bio-text">{profile.bioText}</p>
                </div>
            </div>
            <h3 className="tweet-list-header">Tweets by {profile.displayName}:</h3>
            <TweetList tweets={currentUserTweets} />
        </>
    );
} else {
  pageContent = (
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
}

  return (
    <>
      {pageContent}
    </>
  )
};

export default Profile;
