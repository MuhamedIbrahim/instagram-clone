import React, {useState, useEffect, useCallback} from 'react';
import {auth} from '../firebase';

export const AuthContext = React.createContext({
    isAuth: false,
    username: null,
    setUsername: () => {},
    userAvatar: null,
    setUserAvatar: () => {},
    signedUser: null,
    isSignup: false,
    setIsSignup: () => {},
    login: (e, email, password) => {},
    signup: (e, email, username, password) => {},
    logout: () => {}
})

const AuthProvider = props => {
    const [isAuth, setIsAuth] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [signedUser, setSignedUser] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [signedUserObj, setSignedUserObj] = useState(null);

    useEffect(() => {
        let subscribe = auth.onAuthStateChanged(user => {
            if(user) {
                if(!signedUser) {
                    setSignedUserObj(user);
                    setUserAvatar(user.photoURL);
                    setSignedUser(user.displayName);
                    setIsAuth(true);
                }
            } else {
                setSignedUserObj(null);
                setUserAvatar(null);
                setSignedUser(null);
                setIsAuth(false);
            }
        });
        return () => {
            //unsubscribe
            subscribe();
        }
    }, [signedUser]);

    const login = useCallback((e, email, password) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then(response => {
                setSignedUserObj(response.user);
                setUserAvatar(response.user.photoURL);
                setSignedUser(response.user.displayName);
                setIsAuth(true);
            })
            .catch(error => {
                console.error(error.message);
            });
    }, []);
    
    const signup = useCallback((e, email, username, password) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then(response => {
                setSignedUserObj(response.user);
                setUserAvatar(response.user.photoURL);
                setSignedUser(username);
                setIsAuth(true);
                return response.user.updateProfile({
                    displayName: username
                })
            })
            .catch(error => {
                console.error(error.message);
            });
    }, []);

    const logout = useCallback(() => {
        auth.signOut();
        setIsAuth(false);
        setSignedUserObj(null);
        setUserAvatar(null);
        setSignedUser(null);
        setIsSignup(false);
    }, []);
    
    return (
        <AuthContext.Provider value={{
            isAuth: isAuth,
            username: signedUser,
            setUsername: setSignedUser,
            signedUser: signedUserObj,
            userAvatar: userAvatar,
            setUserAvatar: setUserAvatar,
            isSignup: isSignup,
            setIsSignup: setIsSignup,
            login: login,
            signup: signup,
            logout: logout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;