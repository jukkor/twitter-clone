import React, { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../firebase/firebase';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';
import { useUser } from '../contexts/UserContext';

const ExplorePage = () => {
  const [tweets, setTweets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const tweetsRef = ref(db, 'tweets');

    const unsubscribe = onValue(tweetsRef, async (snapshot) => {
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
              createdAt: value.createdAt
            };
          })
        );

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
