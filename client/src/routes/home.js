import React from 'react'
import Axios from 'axios'

import "../styling/homepage.css"
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
                </div>
            </div>
        </div>
    )
}