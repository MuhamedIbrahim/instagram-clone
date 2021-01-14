import React, {useContext} from 'react';
import './App.css';
import Header from './components/Header/Header';
import Auth from './components/Auth/Auth';
import Posts from './components/Posts/Posts';
import NewPost from './components/NewPost/NewPost';
import EditProfile from './components/EditProfile/EditProfile';
import {AuthContext} from './context/auth-context';
import {NewPostContext} from './context/newPost-context';
import {EditProfileContext} from './context/editProfile-context';

const App = () => {
    const isAuth = useContext(AuthContext).isAuth;
    const isPosting = useContext(NewPostContext).isPosting;
    const isEditing = useContext(EditProfileContext).isEditing;

    return (
        <>
            {isAuth ?
                <>
                    <Header />
                    <div className="App__content">
                        <div className="container">
                            {isEditing ?
                                <EditProfile />
                            :
                                <>
                                    {isPosting ?
                                        <NewPost />
                                    : null}
                                    <Posts />
                                </>
                            }
                        </div>
                    </div>
                </>
            :
                <Auth />
            }
        </>
    );
};

export default App;