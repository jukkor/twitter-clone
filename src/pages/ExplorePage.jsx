import React, { useState, useEffect } from 'react';
import { subscribeToTweets } from '../firebase/firebaseUtilities';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';

import { subscribeToTweets } from '../firebase/firebaseUtilities';

const ExplorePage = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToTweets(setTweets);
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
