import React, {useState, useEffect, useContext} from 'react';
import classes from './Posts.module.css';
import Post from './Post/Post';
import {AuthContext} from '../../context/auth-context';

import {db} from '../../firebase';

const Posts = React.memo(() => {
    const [posts, setPosts] = useState([]);

    const signedUser = useContext(AuthContext).username;

    useEffect(() => {
        let subscribe = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            );
        });
        return () => {
            subscribe();
        }
    }, []);

    return (
        <div className={classes.all_posts}>
            {posts?.map(post => (
                <Post
                    key={post.id}
                    postId={post.id}
                    imageURL={post.imageURL}
                    username={post.username}
                    userAvatar={post.userAvatar}
                    caption={post.caption}
                    comments={post.comments}
                    signedUser={signedUser}
                    time={post.timestamp}
                />
            ))}
        </div>
    );
});

export default Posts;