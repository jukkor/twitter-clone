import { useNavigate } from 'react-router-dom';
import './Tweet.css';

function Tweet({profilePicture, username, content, userId}) {

    const navigate = useNavigate();

    const toProfile = () => {
        navigate(`/user/${userId}`);
    }


  return (
    <>
        <div className="tweet-box">
            <div className="user-info">
                <img className="profile-picture" src={profilePicture} onClick={toProfile}></img>
                <h3 className="profile-username" onClick={toProfile}>{username}</h3>
            </div>
            <p className="tweet-text">{content}</p>
        </div>
    </>
  )
}

export default Tweet;