import { updateProfile } from "firebase/auth";
import { set, ref, onValue, get, remove, runTransaction, push } from "firebase/database";
import { db, auth } from "./firebase.js"

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Automatically parses the ISO 8601 string

    const day = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const month = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const likeTweet = (tweetId) => {
    const likesRef = ref(db, `tweetLikes/${tweetId}/${auth.currentUser.uid}`);
    set(likesRef, true);

    const tweetRef = ref(db, `tweets/${tweetId}/likeCount`);
    runTransaction(tweetRef, (currentValue) => {
        return (currentValue || 0) + 1;
    });
}

export const unLikeTweet = (tweetId) => {
    const likesRef = ref(db, `tweetLikes/${tweetId}/${auth.currentUser.uid}`);
    remove(likesRef);

    const tweetRef = ref(db, `tweets/${tweetId}/likeCount`);
    runTransaction(tweetRef, (currentValue) => {
        return (currentValue || 0) - 1;
    });
}

export const subscribeUserHasLikedTweet = (tweetId, callback) => {
    const likesRef = ref(db, `tweetLikes/${tweetId}/${auth.currentUser.uid}`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(false);
        }
    });

    return unsubscribe;
}

export const subscribeTweetLikeCount = (tweetId, callback) => {
    const likesRef = ref(db, `tweets/${tweetId}/likeCount`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(0);
        }
    });

    return unsubscribe;
}

export const updateUser = (payload) => {
    updateAuthUser(payload);
    updateRealtimeDatabaseUser(payload);
}

export const updateAuthUser = (payload) => {
    const parsedPayload = {
        displayName: payload.displayName,
        photoURL: payload.photoURL
    };
    updateProfile(auth.currentUser, parsedPayload)
        .catch((error) => {
            console.log(error);
        });
}

export const updateRealtimeDatabaseUser = (payload) => {
    set(ref(db, "users/" + auth.currentUser.uid), payload)
        .catch((error) => {
            console.log(error);
        });
}

export const getUser = async (uid) => {
    try {
        const userRef = ref(db, "users/" + uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("User not found")
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

export const sendComment = (tweetId, payload) => {
    const commentRef = push(ref(db, `comments/${tweetId}`));
    set(commentRef, payload);
}

export const subscribeToTweetComments = (tweetId, callback) => {
    try {
        const commentRef = ref(db, `comments/${tweetId}`)

        const unsubscribe = onValue(commentRef, async (snapshot) => {
            if (snapshot.exists()) {
                const commentsSnapshot = snapshot.val();
                const comments = [];

                for (const [commentId, commentData] of Object.entries(commentsSnapshot)) {
                    const senderProfile = await getUser(commentData.userId);
                    const comment = { ...commentData, id: commentId }
                    const payload = Object.assign(senderProfile, comment);
                    comments.push(payload);
                }

                callback(comments);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error fetching tweets from followed users:", error);
        return () => { }
    }
}

export const subscribeCommentLikeCount = (tweetId, commentId, callback) => {
    const likesRef = ref(db, `comments/${tweetId}/${commentId}/likeCount`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(0);
        }
    });

    return unsubscribe;
}

export const subscribeHasLikedComment = (commentId, callback) => {
    const likesRef = ref(db, `commentLikes/${commentId}/${auth.currentUser.uid}`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(false);
        }
    });

    return unsubscribe;
}

export const likeComment = (tweetId, commentId) => {
    const likesRef = ref(db, `commentLikes/${commentId}/${auth.currentUser.uid}`);
    set(likesRef, true);

    const tweetRef = ref(db, `comments/${tweetId}/${commentId}/likeCount`);
    runTransaction(tweetRef, (currentValue) => {
        return (currentValue || 0) + 1;
    });
}

export const unLikeComment = (tweetId, commentId) => {
    const likesRef = ref(db, `commentLikes/${commentId}/${auth.currentUser.uid}`);
    remove(likesRef);

    const tweetRef = ref(db, `comments/${tweetId}/${commentId}/likeCount`);
    runTransaction(tweetRef, (currentValue) => {
        return (currentValue || 0) - 1;
    });
}

export const subscribeToFollowedUsersTweets = (userId, callback) => {
    try {
        const followingRef = ref(db, `following/${userId}`)

        // Listen for changes in the list of followed users
        const unsubscribe = onValue(followingRef, async (snapshot) => {
            if (snapshot.exists()) {
                const followedUsers = snapshot.val();

                // Fetch all tweets and filter them based on followed users
                const tweetsRef = ref(db, 'tweets');
                const tweetsSnapshot = await get(tweetsRef);

                if (tweetsSnapshot.exists()) {
                    const allTweets = tweetsSnapshot.val();
                    const followedUserTweets = [];

                    // Loop through all tweets and check if the userId is in followed users
                    for (const [tweetId, tweetData] of Object.entries(allTweets)) {
                        const userId = tweetData.userId; // Assuming each tweet has a userId

                        if (followedUsers[userId] || userId == auth.currentUser.uid) {
                            const senderProfile = await getUser(userId);
                            const tweet = { ...tweetData, id: tweetId };
                            const payload = Object.assign(senderProfile, tweet);
                            followedUserTweets.push(payload);
                        }
                    }
                    const reversedTweetArray = followedUserTweets.reverse();
                    callback(reversedTweetArray);
                } else {
                    console.log('No tweets found');
                    callback([]);
                }
            } else {
                console.log('No followed users found');
                callback([]);
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching tweets from followed users:", error);
        return () => { }
    }
}


export const subscribeToUser = (uid, callback) => {
    const userRef = ref(db, `users/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            console.log('User not found');
            callback(null);
        }
    });

    return unsubscribe;
}

export const subscribeIsFollowing = (userIdToCheck, callback) => {
    // Check if current user is following provided user

    try {
        const currentUserId = auth.currentUser.uid;
        const userRef = ref(db, `following/${currentUserId}/${userIdToCheck}`);

        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            } else {
                callback(false);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error("Failed to attach listener to follow state:", error);
        return () => { };
    }
}

export const subscribeToTweets = (callback) => {
    const tweetsRef = ref(db, 'tweets');
    const unsubscribe = onValue(tweetsRef, async (snapshot) => {
        const data = snapshot.val();

        if (data) {
            const tweetsArray = await Promise.all(
                Object.entries(data).map(async ([key, tweet]) => {
                    const userProfile = await getUser(tweet.userId);
                    return {
                        id: key,
                        userId: tweet.userId,
                        displayName: userProfile?.displayName || null,
                        photoURL: userProfile?.photoURL || null,
                        content: tweet.content,
                        likeCount: tweet.likeCount,
                        createdAt: tweet.createdAt
                    };
                })
            );
            const reversedTweetsArray = tweetsArray.reverse();
            callback(reversedTweetsArray);
        } else {
            callback([]);
        }
    });

    return unsubscribe;
}

export const followUser = (userIdToFollow) => {
    // creates a new entry to "firebase/following/currentUserId/followedUserId"
    // creates a new entry to "firebase/followers/followedUserId/currentUserId"
    try {
        const currentUserId = auth.currentUser.uid;
        const followingRef = ref(db, `following/${currentUserId}/${userIdToFollow}`);
        set(followingRef, true);

        const followersRef = ref(db, `followers/${userIdToFollow}/${currentUserId}`)
        set(followersRef, true);
    } catch (error) {
        console.error("Failed to follow user:", error);
    }
}

export const unFollowUser = (userIdToUnfollow) => {
    // removes or at least changes value to false at
    // "firebase/following/currentUserId/followedUserId"
    // and "firebase/followers/followedUserId/currentUserId"
    try {
        const currentUserId = auth.currentUser.uid;
        const followingRef = ref(db, `following/${currentUserId}/${userIdToUnfollow}`);
        remove(followingRef)

        const followersRef = ref(db, `followers/${userIdToUnfollow}/${currentUserId}`)
        remove(followersRef);
    } catch (error) {
        console.error("Failed to unfollow user:", error);
    }
}
