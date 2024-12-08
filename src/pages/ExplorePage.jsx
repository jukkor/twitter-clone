import React, { useState, useEffect } from 'react';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';
import { useUser } from '../contexts/UserContext';

import { subscribeToTweets } from '../firebase/firebaseUtilities';

const ExplorePage = () => {
  const [tweets, setTweets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    subscribeToTweets(setTweets);
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
