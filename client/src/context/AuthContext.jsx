import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth, API_URL } from '../firebase';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            console.error('Firebase Auth is not initialized. Check your environment variables.');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile from backend
                try {
                    const token = await user.getIdToken();
                    const response = await axios.get(`${API_URL}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(response.data || {});
                } catch (error) {
                    console.error('Error fetching user profile:', error.response?.data || error.message);
                    setUserProfile({}); // Set to empty object so we don't block
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email, password, fullName, barCouncilNumber) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with display name
        await updateProfile(userCredential.user, {
            displayName: fullName
        });

        // Create user profile in backend
        const token = await userCredential.user.getIdToken();
        await axios.post(
            `${API_URL}/api/users/profile`,
            {
                email,
                fullName,
                barCouncilNumber
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return userCredential;
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Create or update user profile in backend with Google photo
        const token = await result.user.getIdToken();
        await axios.post(
            `${API_URL}/api/users/profile`,
            {
                email: result.user.email,
                fullName: result.user.displayName,
                photoURL: result.user.photoURL,
                barCouncilNumber: ''
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return result;
    };

    const signOut = () => {
        return firebaseSignOut(auth);
    };

    const value = {
        currentUser,
        userProfile,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
