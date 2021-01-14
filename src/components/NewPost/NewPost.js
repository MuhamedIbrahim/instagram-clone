import React, {useState, useContext, useCallback} from 'react';
import firebase from 'firebase';
import classes from './NewPost.module.css';
import {AuthContext} from '../../context/auth-context';
import {NewPostContext} from '../../context/newPost-context';
import {db, storage} from '../../firebase';

const NewPost = () => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const username = useContext(AuthContext).username;
    const userAvatar = useContext(AuthContext).userAvatar;
    const setIsPosting = useContext(NewPostContext).setIsPosting;

    const handleImageChange = useCallback((e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }, []);

    const handleUploading = useCallback(() => {
        const nowDate = Date.now();
        const uploadTask = storage.ref(`images/${image.name}${nowDate}`).put(image);
        uploadTask.on(
        'state_changed',
        snapshot => {
            const progressing = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressing);
        },
        error => {
            console.error(error.message);
        },
        () => {
            storage.ref('images').child(image.name + nowDate).getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption.trim(),
                        username: username,
                        imageURL: url,
                        userAvatar: userAvatar
                    });
                    setCaption('');
                    setImage(null);
                    setProgress(0);
                    setIsPosting(false)
                })
                .catch(error => {
                    console.error(error.message);
                });
        });
    }, [image, caption, username, userAvatar, setIsPosting]);

    return (
        <div className={classes.new_post}>
            <h2 className={classes.new_post__title}>Add New Post</h2>
            <input type="text" placeholder="Post caption" value={caption} onInput={e => setCaption(e.target.value)} />
            <label>Post image:</label>
            <input type="file" accept="image/*" onChange={e => handleImageChange(e)} />
            {progress !== 0 && progress !== 100 ?
                <div className={classes.new_post__progress}>
                    <div style={{width: progress}} className={classes.new_post__progress__loader}></div>
                </div>
            : null}
            <button disabled={!image} className={classes.new_post__add} onClick={handleUploading}>Post</button>
            <button className={classes.new_post__cancel} onClick={() => setIsPosting(false)}>Cancel</button>
        </div>
    );
};

export default NewPost;