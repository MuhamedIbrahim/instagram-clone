import React, {useContext} from 'react';
import classes from './Auth.module.css';
import Sign from './Sign/Sign';
import {AuthContext} from '../../context/auth-context';

const Auth = () => {
    const context = useContext(AuthContext);

    return (
        <div className={classes.auth}>
            <Sign
                type={context.isSignup ? 'signup' : 'login'}
                login={context.login}
                signup={context.signup}
                setIsSignup={context.setIsSignup}
            />
        </div>
    );
};

export default Auth;