import React, { useState, useEffect } from 'react';

import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';
import { useUser } from '../contexts/UserContext';

import examplePfp from '../assets/google.png';

function ExplorePage() {
  const [tweets, setTweets] = useState([]);

  const { user } = useUser();
  console.log(user);

  console.log()

  useEffect(() => {
    const tweetsRef = ref(db, 'tweets');

    const unsubscribe = onValue(tweetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tweetsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          username: value.displayName,
          profilePicture: examplePfp,
          content: value.content
        }));
        setTweets(tweetsArray);
      } else {
        setTweets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Sidebar />
      <div>
        <h1>Explore Page</h1>
        <TweetList tweets={tweets} />
      </div>
    </>
  );
}

export default ExplorePage;
