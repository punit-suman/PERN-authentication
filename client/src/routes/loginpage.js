import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';

import Registration from '../components/registration'
import Login from '../components/login'

import '../styling/loginpage.css'


export default function LoginPage({loginDetail}) {
    
    const loginStatus = loginDetail !== ""

    const [showRegistration, setShowRegistration] = useState('hide')
    const [showLogin, setShowLogin] = useState('show')

    const bgDarkColor = 'bg-color-dark'
    const bgLightColor = 'bg-color-light'
    const [loginBtnBg, setLoginBtnBg] = useState(bgDarkColor)
    const [registerBtnBg, setRegisterBtnBg] = useState(bgLightColor)

    Axios.defaults.withCredentials = true

    const showLoginComponent = () => {
        setShowLogin('show')
        setShowRegistration('hide')
        setLoginBtnBg(bgDarkColor)
        setRegisterBtnBg(bgLightColor)
    }
    const showRegistrationComponent = () => {
        setShowLogin('hide')
        setShowRegistration('show')
        setLoginBtnBg(bgLightColor)
        setRegisterBtnBg(bgDarkColor)
    }
    if (!loginStatus) {
        return(
            <div className="login-container">
                <div className="home-container">
                    <Link to="/" className="home-link">Home</Link>
                </div>
                <div className="buttons-container">
                    <div className="btn">
                        <button onClick={showLoginComponent} className={loginBtnBg}>Login</button>
                    </div>
                    <div className="btn">
                        <button onClick={showRegistrationComponent} className={registerBtnBg}>Register</button>
                    </div>
                </div>
                <div className="main-container">
                    <div className={showRegistration}>
                        <Registration />
                    </div>
                    <div className={showLogin}>
                        <Login />
                    </div>
                </div>
            </div>
        )
    } else {
        window.location.href = "/"
    }
}