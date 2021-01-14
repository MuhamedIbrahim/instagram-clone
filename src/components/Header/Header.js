import React, {useContext, useState} from 'react';
import classes from './Header.module.css';
import logo from './logo.png';
import {AuthContext} from '../../context/auth-context';
import {NewPostContext} from '../../context/newPost-context';
import {EditProfileContext} from '../../context/editProfile-context';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

const Header = () => {
    const logout = useContext(AuthContext).logout;
    const userAvatar = useContext(AuthContext).userAvatar;
    const setIsPosting = useContext(NewPostContext).setIsPosting;
    const isEditing = useContext(EditProfileContext).isEditing;
    const setIsEditing = useContext(EditProfileContext).setIsEditing;

    const [headerMenu, setHeaderMenu] = useState('none');

    return (
        <header className={classes.main_header}>
            <div className={`container ${classes.main_header__content}`}>
                <img className={classes.main_header__logo} src={logo} alt="Instagram" />
                <nav className={classes.main_header__nav}>
                    {!isEditing ?
                        <button className={classes.main_header__new_post} onClick={() => setIsPosting(true)}>New Post</button>
                    : null}
                    <div className={classes.main_header__avatar}>
                        <div onClick={() => setHeaderMenu(prevState => prevState === 'none' ? 'block' : 'none')} className={classes.main_header__avatar__container}>
                            {userAvatar ?
                                <img src={userAvatar} width="40px" height="40px" alt="" />
                            :
                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                            }
                        </div>
                        <ul style={{display: headerMenu}}>
                            <div className={classes.nav_arrow}></div>
                            <li>
                                <button onClick={() => {
                                    setHeaderMenu('none');
                                    setIsEditing(true);
                                }}>
                                    <PersonOutlineIcon />Edit Profile
                                </button>
                            </li>
                            <li className={classes.main_header__logout}>
                                <button onClick={() => {
                                    setHeaderMenu('none');
                                    logout(false);
                                }}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;