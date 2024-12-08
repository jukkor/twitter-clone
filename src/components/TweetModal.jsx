import React from "react";

const TweetModal = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <>
        {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
          <div className="tweet-box-modal">
            <div className="user-info">
                <img className="tweet-profile-picture" src={profilePicture} onClick={toProfile} alt="Profile profile" />
                <h3 className="profile-username" onClick={toProfile}>{username}</h3>
                <p className="created-at-text">{createdAt}</p>
            </div>
            <p className="tweet-text">{content}</p>
            <button onClick={handleLike} className="like-button">
                {hasLiked ? 'Unlike' : 'Like'} ({currentLikeCount})
            </button>
        </div>
          </div>
        </>
      )}
        </>
    );
}

export default TweetModal;