import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';

import Sidebar from '../components/Sidebar';

import './Profile.css';

const Profile = () => {
  let { id } = useParams();

  console.log(id);

  const [profile, setProfile] = useState({
    displayName: '',
    photoURL: '',
    bioText: '',
  });

  useEffect(() => {

    try {

    const userRef = ref(db, `/users/${id}`);

    const unsubscribe = onValue(userRef, (snapshot) => {

      const data = snapshot.val();
      console.log('Fetched data:', data);

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

    return () => unsubscribe();
      
    } catch (error) {
      
      console.log("Error!")

    }

  }, [id]);

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
    </>
  );
};

export default Profile;
