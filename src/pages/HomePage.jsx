import { useEffect, useState } from 'react';
import { subscribeToFollowedUsersTweets } from '../firebase/firebaseUtilities';
import { auth } from '../firebase/firebase';

import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';
import { useUser } from '../contexts/UserContext';
import TweetBox from '../components/TweetBox';

const HomePage = () => {
  const [followedUserTweets, setFollowedUserTweets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const unsubscribe = subscribeToFollowedUsersTweets(user.uid, setFollowedUserTweets);

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <>
      <Sidebar />
      <div>
        <h1>Home page</h1>
      </div>
      <TweetBox />
      {followedUserTweets
        ? <>
          <div>
            <TweetList tweets={followedUserTweets} />
          </div>
        </>
        : <></>
      }
    </>
  )
}

export default HomePage;
