import React from 'react'
import Axios from 'axios'

import Navbar from '../components/navbar'

export default function Homepage({loginDetail}) {
    Axios.defaults.withCredentials = true
    return (
        <div className="home-container">
            <div>
                <Navbar loginDetail={loginDetail} />
            </div>
            <div className="body-container">
                <div className="message">
                    Welcome to the website.
                    <a href='/privacyPolicy.html' target='_blank'>Privacy Policy</a>
                    <a href='/termsAndConditions.html' target='_blank'>T&C</a>
                </div>
            </div>
        </div>
    )
}