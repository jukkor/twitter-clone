import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { sendTweet } from "../firebase/firebaseUtilities";

import "./TweetBox.css";

const TweetBox = () => {

    const [content, setContent] = useState("");
    const { user } = useUser();

    const handleSend = () => {
        sendTweet(content);
    }

    return (
        <>
            <div className="tweet-sending-box">
                <div className="comment-area">
                    <img src={user.photoURL} />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing..."
                    />
                </div>
                <div className="button-container">
                    <button className="button-send" onClick={handleSend}>Send</button>
                </div>
            </div>
        </>
    );
}

export default TweetBox;
