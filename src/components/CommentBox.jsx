import { useState } from "react";
import { format } from 'date-fns';

import "./CommentBox.css";
import { useUser } from "../contexts/UserContext";
import { sendComment } from "../firebase/firebaseUtilities";

const CommentBox = ({ id }) => {
    const [comment, setComment] = useState("");
    const { user } = useUser();

    const handleSend = () => {
        const payload = {
            userId: user.uid,
            createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
            content: comment,
            likeCount: 0
        }
        sendComment(id, payload);
    }

    return (
        <>
            <div className="comment-box">
                <div className="comment-area">
                    <img src={user.photoURL} />
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Start typing..."
                    />
                </div>
                <div className="button-container">
                    <button className="button-send" onClick={handleSend}>Send</button>
                </div>
            </div>
        </>
    )
}

export default CommentBox;
