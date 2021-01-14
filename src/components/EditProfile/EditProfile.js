import React, {useContext, useState, useCallback, useRef} from 'react';
import classes from './EditProfile.module.css';
import Loader from '../UI/Loader/Loader';
import {AuthContext} from '../../context/auth-context';
import {EditProfileContext} from '../../context/editProfile-context';
import {auth, storage} from '../../firebase';

const EditProfile = () => {
    const username = useContext(AuthContext).username;
    const setUsername = useContext(AuthContext).setUsername;
    const userAvatar = useContext(AuthContext).userAvatar;
    const setUserAvatar = useContext(AuthContext).setUserAvatar;
    const userObj = useContext(AuthContext).signedUser;
    const setIsEditing = useContext(EditProfileContext).setIsEditing;

    const newAvatar = useRef(null);
    
    const [newUsername, setNewUsername] = useState(username);
    const [newAvatarURL, setNewAvatarURL] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleUploading = useCallback((e) => {
        if(e.target.files[0]) {
            const newAvatarFile = newAvatar.current.files[0];
            const nowDate = Date.now();
            const uploadTask = storage.ref(`profiles/${newAvatarFile.name}_${userObj.uid}_${nowDate}`).put(newAvatarFile);
            uploadTask.on(
                'state_changed',
                () => {},
                error => { console.error(error.message)},
                () => {
                    storage.ref('profiles').child(`${newAvatarFile.name}_${userObj.uid}_${nowDate}`).getDownloadURL()
                        .then(url => {
                            setNewAvatarURL(url);
                        })
                        .catch(error => {
                            console.error(error.message);
                        });
                }
            );
        }
    }, [newAvatar, userObj.uid]);

    const handleSubmitEdits = useCallback(() => {
        setSaveLoading(true);

        const updatedProfile = {};
        
        if(newUsername && newAvatarURL) {
            updatedProfile.displayName = newUsername;
            updatedProfile.photoURL = newAvatarURL;
        } else if(newUsername) {
            updatedProfile.displayName = newUsername;
        } else if(newAvatarURL) {
            updatedProfile.photoURL = newAvatarURL;
        }
        
        auth.currentUser.updateProfile(updatedProfile)
            .then(response => {
                if(newUsername && newAvatarURL) {
                    setUserAvatar(newAvatarURL);
                    setUsername(newUsername);
                } else if(newUsername) {
                    setUsername(newUsername);
                } else if(newAvatarURL) {
                    setUserAvatar(newAvatarURL);
                }
                setSaveLoading(false);
                setIsEditing(false);
            })
            .catch(error => {
                setSaveLoading(false);
                console.error(error.message);
            });

    }, [newUsername, newAvatarURL, setUsername, setIsEditing, setUserAvatar]);

    return (
        <div className={classes.edit_profile}>
            {saveLoading ? <Loader /> : null}
            <div className={classes.edit_profile__row}>
                <div className={classes.edit_profile__col}>
                    <div className={classes.edit_profile__avatar}>
                        {newAvatarURL ?
                            <img src={newAvatarURL} width="40px" height="40px" alt="" />
                        :
                            <>
                                {userAvatar ?
                                    <img src={userAvatar} width="40px" height="40px" alt="" />
                                :
                                    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                                }
                            </>
                        }
                    </div>
                </div>
                <div className={classes.edit_profile__col}>
                    <h2 className={classes.edit_profile__username}>{username}</h2>
                    <label htmlFor="avatarChange" className={classes.edit_profile__avatar_edit}>Change Profile Photo</label>
                    <input ref={newAvatar} onChange={e => handleUploading(e)} className={classes.edit_profile__avatar_edit_input} id="avatarChange" type="file" accept="image/*" />
                </div>
            </div>
            <div className={classes.edit_profile__row}>
                <div className={classes.edit_profile__col}>
                    <span>Username</span>
                </div>
                <div className={classes.edit_profile__col}>
                    <input type="text" value={newUsername} onInput={e => setNewUsername(e.target.value)} />
                </div>
            </div>
            <div className={classes.edit_profile__row}>
                <div className={classes.edit_profile__btns}>
                    <button onClick={handleSubmitEdits} disabled={username === newUsername && !newAvatarURL} className={classes.edit_profile__submit}>Submit</button>
                    <button onClick={() => setIsEditing(false)} className={classes.edit_profile__cancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;