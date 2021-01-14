import React, {useState, useEffect, useCallback, useMemo} from 'react';
import classes from './Post.module.css';
import {db} from '../../../firebase';
import firebase from 'firebase';

const Post = ({postId, username, userAvatar, imageURL, caption, signedUser, time}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => (
                    {
                        id: doc.id,
                        ...doc.data()
                    }
                )))
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const dateFormated = useMemo(() => {
        if(time) {
            const timeNow = Math.round(Date.now() / 1000),
                postTime = Math.round(time.seconds),
                seconds = timeNow - postTime;
            if(seconds < 60) {
                return seconds + ' seconds';
            } else if(seconds / 60 < 60 && seconds / 60 > 0.9) {
                return Math.round(seconds / 60) + ' minutes';
            } else if(seconds / 3600 < 24 && seconds / 3600 > 0.9) {
                return Math.round(seconds / 3600) + ' hours';
            } else if(seconds / 86400 < 7 && seconds / 86400 > 0.9) {
                return Math.round(seconds / 86400) + ' days';
            } else if(seconds / 2.628e+6 < 30 && seconds / 2.628e+6 > 0.9) {
                return Math.round(seconds / 2.628e+6) + ' months';
            } else if(seconds / 3.154e+7 < 12 && seconds / 3.154e+7 > 0.9) {
                return Math.round(seconds / 3.154e+7) + ' years';
            }
        }
    }, [time]);

    const addCommentsHandler = useCallback((e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: newComment.trim(),
            username: signedUser,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setNewComment('');
    }, [newComment, postId, signedUser]);

    return (
        <div className={classes.post}>
            <div className={classes.post__header}>
                <div className={classes.post__user}>
                    <div className={classes.post__user__avatar}>
                        {userAvatar ?
                            <img src={userAvatar} width="40px" height="40px" alt="" />
                        :
                            <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                        }
                    </div>
                    <h3 className={classes.post__user__name}>{username}</h3>
                </div>
            </div>
            <div className={classes.post__img}>
                <img src={imageURL} alt="Post" />
            </div>
            {caption || comments ?
                <div className={classes.post__comments}>
                    {caption ?
                        <div className={classes.post__comment}>
                            <span>{username}</span> {caption}
                        </div>
                    : null }
                    {comments.map(comment => (
                        <div key={comment.id} className={classes.post__comment}>
                            <span>{comment.username}</span> {comment.text}
                        </div>
                    ))}
                </div>
            : null}
            <div className={classes.post__time}>
                <span>{dateFormated} ago</span>
            </div>
            <div className={classes.post__add_comment}>
                <form onSubmit={e => addCommentsHandler(e)}>
                    <input type="text" placeholder="Add a comment" value={newComment} onInput={e => setNewComment(e.target.value)} />
                    <button disabled={!newComment} type="submit">Post</button>
                </form>
            </div>
        </div>
    );
};

export default Post;