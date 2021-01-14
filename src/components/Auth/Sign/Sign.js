import React, {useState} from 'react';
import classes from './Sign.module.css';
import logo from './logo.png';

const Sign = ({type, login, signup, setIsSignup}) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className={classes.sign}>
            <div className={classes.sign__method}>
                <div className={classes.sign__logo}>
                    <img src={logo} alt="instagram" />
                </div>
                {type === 'signup' ?
                    <h4>Sign up to see photos and videos from your friends.</h4>
                : null}
                <form onSubmit={(e) => type === 'signup' ? signup(e, email, username, password) : login(e, email, password)}>
                    <input placeholder="Email" type="email" value={email} onInput={e => setEmail(e.target.value.trim())} />
                    {type === 'signup' ?
                        <input placeholder="Username" type="text" value={username} onInput={e => setUsername(e.target.value.trim())} />
                    : null}
                    <input placeholder="Password" type="password" value={password} onInput={e => setPassword(e.target.value)} />
                    <button disabled={type === 'login' ? (!email || !password) : !email || !username || !password} type="submit">{type === 'login' ? 'Log In' : 'Sign Up'}</button>
                </form>
            </div>
            <div className={classes.sign__other}>
                {type === 'login' ?
                    <p>Don't have an account? <span onClick={() => {
                        setIsSignup(true);
                        setEmail('');
                        setPassword('');
                    }}>Sign up</span></p>
                :
                    <p>Have an account? <span onClick={() => {
                        setIsSignup(false);
                        setEmail('');
                        setUsername('');
                        setPassword('');
                    }}>Log in</span></p>
                }
            </div>
        </div>
    );
};

export default Sign;