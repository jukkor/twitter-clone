import Comment from './Comment';

import "./CommentList.css";

const CommentList = ({ comments }) => {
    return (
        <div className="comment-list">
            {comments.map((comment, index) => (
                <Comment key={index} {...comment} />
            ))}
        </div>
    );
}

export default CommentList;
