import Comment from './Comment';

import "./CommentList.css";

const CommentList = ({ tweetId, comments }) => {
    return (
        <div className="comment-list">
            {comments.map((comment, index) => (
                <Comment key={index} tweetId={tweetId} {...comment} />
            ))}
        </div>
    );
}

export default CommentList;
