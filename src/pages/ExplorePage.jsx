import React, { useState, useEffect } from 'react';
import { subscribeToTweets } from '../firebase/firebaseUtilities';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';

import './ExplorePage.css';
import TweetBox from '../components/TweetBox';

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
        <h1 className="explore-header">Explore</h1>
        <TweetBox />
        <TweetList tweets={tweets} />
      </div>
    </>
  );
}

export default ExplorePage;
