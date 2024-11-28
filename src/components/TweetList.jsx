import Tweet from './Tweet';

function TweetList({ tweets }) {
  return (
    <div className="tweet-list">
      {tweets.map((tweet, index) => (
        <Tweet key={index} {...tweet} />
      ))}
    </div>
  );
}

export default TweetList;