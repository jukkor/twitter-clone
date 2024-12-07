import { updateProfile } from "firebase/auth";
import { set, ref, onValue, get } from "firebase/database";
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

export const subscribeToUser = async (uid, callback) => {
    const userRef = ref(db, `users/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            console.log('User not found');
            callback(null);
        }
    });

    return () => unsubscribe;
}

export const subscribeToTweets = async (callback) => {
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
                        username: userProfile?.displayName || null,
                        profilePicture: userProfile?.photoURL || null,
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

    return () => unsubscribe;
}
