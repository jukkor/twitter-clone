
import "./Comment.css";

const Comment = ({ photoURL, displayName, content }) => {
    return (
        <>
            <div className="comment-container">
                <div className="comment-sender">
                    <img src={photoURL} />
                    <h3>{displayName}</h3>
                </div>
                <div className="comment-content">
                    <p>{content}</p>
                    <button className="button-like">Like</button>
                </div>
            </div>
        </>
    )
}

export default Comment;
