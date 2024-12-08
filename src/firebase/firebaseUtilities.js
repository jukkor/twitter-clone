import { updateProfile } from "firebase/auth";
import { set, ref, onValue, get, remove } from "firebase/database";
import { db, auth } from "./firebase.js"

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
                            const tweet = {
                                tweetId,
                                userId,
                                content: tweetData.content,
                                likeCount: tweetData.likeCount,
                            }
                            const payload = Object.assign(senderProfile, tweet);
                            followedUserTweets.push(payload);
                        }
                    }

                    callback(followedUserTweets);
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
                    };
                })
            );
            callback(tweetsArray);
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
